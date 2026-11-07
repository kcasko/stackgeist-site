import { PARTNER_OFFERS } from '../data/partnerOffers.ts';

export function configuredOfferId(href: string): string {
  try {
    const url = new URL(href);
    return Object.values(PARTNER_OFFERS).find(offer => offer.url && new URL(offer.url).href === url.href)?.id ?? '';
  } catch { return ''; }
}

export function isPaidAffiliateUrl(href: string): boolean {
  try {
    const url = new URL(href);
    return (url.protocol === 'https:' && /^(www\.)?amazon\.com$/.test(url.hostname)
      && url.searchParams.get('tag') === 'deskrespawn-20') || Boolean(configuredOfferId(href));
  } catch { return false; }
}
