interface EventPayload {
  eventType: 'landing' | 'affiliate_click';
  pagePath: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  placement: string;
  productId: string;
  schemaVersion: string;
}

interface AnalyticsPoint {
  blobs: string[];
  doubles: number[];
  indexes: string[];
}

interface Env {
  AFFILIATE_ANALYTICS: {
    writeDataPoint(point: AnalyticsPoint): void;
  };
}

interface PagesContext {
  request: Request;
  env: Env;
}

const MAX_BODY_BYTES = 4096;
const LIMITS: Record<keyof EventPayload, number> = {
  eventType: 24,
  pagePath: 256,
  utmSource: 80,
  utmMedium: 80,
  utmCampaign: 120,
  utmContent: 120,
  placement: 80,
  productId: 64,
  schemaVersion: 8,
};

const stringWithin = (value: unknown, max: number): value is string =>
  typeof value === 'string' && value.length <= max;

export function validateEventPayload(input: unknown): EventPayload | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const value = input as Record<string, unknown>;
  if (value.eventType !== 'landing' && value.eventType !== 'affiliate_click') return null;
  if (!stringWithin(value.pagePath, LIMITS.pagePath) || !value.pagePath.startsWith('/')) return null;

  const fields: (keyof EventPayload)[] = [
    'utmSource',
    'utmMedium',
    'utmCampaign',
    'utmContent',
    'placement',
    'productId',
    'schemaVersion',
  ];
  for (const field of fields) {
    if (!stringWithin(value[field], LIMITS[field])) return null;
  }
  if (value.schemaVersion !== '1') return null;

  return {
    eventType: value.eventType,
    pagePath: value.pagePath,
    utmSource: value.utmSource,
    utmMedium: value.utmMedium,
    utmCampaign: value.utmCampaign,
    utmContent: value.utmContent,
    placement: value.placement,
    productId: value.productId,
    schemaVersion: value.schemaVersion,
  };
}

const response = (status: number) => new Response(null, {
  status,
  headers: { 'Cache-Control': 'no-store' },
});

export async function onRequest(context: PagesContext): Promise<Response> {
  const { request, env } = context;
  if (request.method !== 'POST') return response(405);

  const requestUrl = new URL(request.url);
  const origin = request.headers.get('origin');
  if (origin && origin !== requestUrl.origin) return response(403);

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().startsWith('application/json')) return response(415);

  const declaredLength = Number(request.headers.get('content-length') || 0);
  if (declaredLength > MAX_BODY_BYTES) return response(413);

  let text: string;
  try {
    text = await request.text();
  } catch {
    return response(400);
  }
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) return response(413);

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return response(400);
  }

  const event = validateEventPayload(parsed);
  if (!event) return response(400);
  if (!env?.AFFILIATE_ANALYTICS?.writeDataPoint) return response(503);

  const day = new Date().toISOString().slice(0, 10);
  env.AFFILIATE_ANALYTICS.writeDataPoint({
    blobs: [
      event.eventType,
      event.pagePath,
      event.utmSource,
      event.utmMedium,
      event.utmCampaign,
      event.utmContent,
      event.placement,
      event.productId,
      event.schemaVersion,
    ],
    doubles: [1],
    indexes: [`${event.eventType}:${day}`],
  });

  return response(204);
}
