export interface CampaignAttribution {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
}

interface AffiliateEvent extends CampaignAttribution {
  eventType: 'landing' | 'affiliate_click';
  pagePath: string;
  placement: string;
  productId: string;
  schemaVersion: '1';
}

const CAMPAIGN_KEY = 'stackgeist:affiliate:campaign';
const LANDING_PREFIX = 'stackgeist:affiliate:landing:';
const MAX_LENGTH = 120;

const clean = (value: string | null, max = MAX_LENGTH) => (value || '').trim().slice(0, max);

export function readCampaign(params: URLSearchParams): CampaignAttribution {
  return {
    utmSource: clean(params.get('utm_source'), 80),
    utmMedium: clean(params.get('utm_medium'), 80),
    utmCampaign: clean(params.get('utm_campaign')),
    utmContent: clean(params.get('utm_content')),
  };
}

export function extractProductId(href: string): string {
  try {
    const path = new URL(href).pathname;
    return path.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})(?:\/|$)/i)?.[1]?.toUpperCase() || '';
  } catch {
    return '';
  }
}

function storedCampaign(): CampaignAttribution {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(CAMPAIGN_KEY) || '{}');
    return {
      utmSource: clean(parsed.utmSource, 80),
      utmMedium: clean(parsed.utmMedium, 80),
      utmCampaign: clean(parsed.utmCampaign),
      utmContent: clean(parsed.utmContent),
    };
  } catch {
    return { utmSource: '', utmMedium: '', utmCampaign: '', utmContent: '' };
  }
}

function currentCampaign(): CampaignAttribution {
  const incoming = readCampaign(new URL(window.location.href).searchParams);
  if (Object.values(incoming).some(Boolean)) {
    try { sessionStorage.setItem(CAMPAIGN_KEY, JSON.stringify(incoming)); } catch { /* storage can be unavailable */ }
    return incoming;
  }
  return storedCampaign();
}

function sendEvent(event: AffiliateEvent): void {
  const body = JSON.stringify(event);
  try {
    if (navigator.sendBeacon('/api/events', new Blob([body], { type: 'application/json' }))) {
      forwardToCloudflareAnalytics(event);
      return;
    }
  } catch { /* use keepalive fallback */ }
  void fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
    credentials: 'same-origin',
  }).catch(() => undefined);
  forwardToCloudflareAnalytics(event);
}

// Mirror click events into Cloudflare Web Analytics so you can see them in the
// CF dashboard next to page-view metrics. The beacon exposes __cfBeacon.push
// (or window.cfBeacon) once loaded — degrade silently if not present.
type CFBeaconPush = (evt: { name: string; data?: Record<string, string | number> }) => void;
declare global {
  interface Window {
    __cfBeacon?: { push?: CFBeaconPush };
    cfBeacon?: { push?: CFBeaconPush };
  }
}
function forwardToCloudflareAnalytics(event: AffiliateEvent): void {
  if (event.eventType !== 'affiliate_click') return;
  try {
    const push = window.__cfBeacon?.push || window.cfBeacon?.push;
    if (typeof push !== 'function') return;
    push({
      name: 'affiliate_click',
      data: {
        placement: event.placement.slice(0, 64),
        product: event.productId || 'search-link',
        page: event.pagePath.slice(0, 128),
      },
    });
  } catch { /* never let analytics break navigation */ }
}

function baseEvent(campaign: CampaignAttribution): Omit<AffiliateEvent, 'eventType' | 'placement' | 'productId'> {
  return {
    pagePath: window.location.pathname.slice(0, 256) || '/',
    ...campaign,
    schemaVersion: '1',
  };
}

function initializeAttribution(): void {
  const campaign = currentCampaign();
  const base = baseEvent(campaign);
  const landingKey = `${LANDING_PREFIX}${base.pagePath}`;
  try {
    if (!sessionStorage.getItem(landingKey)) {
      sessionStorage.setItem(landingKey, '1');
      sendEvent({ ...base, eventType: 'landing', placement: '', productId: '' });
    }
  } catch {
    sendEvent({ ...base, eventType: 'landing', placement: '', productId: '' });
  }

  const selector = 'a[data-affiliate-link], a[href*="tag=deskrespawn-20"]';
  document.querySelectorAll<HTMLAnchorElement>(selector).forEach((anchor) => {
    anchor.addEventListener('click', () => {
      sendEvent({
        ...base,
        eventType: 'affiliate_click',
        placement: clean(anchor.dataset.affiliatePlacement || 'affiliate-link', 80),
        productId: clean(extractProductId(anchor.href), 64),
      });
    });
  });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') initializeAttribution();
