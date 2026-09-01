export const PINTEREST_CONSENT_KEY = 'stackgeist:pinterest-consent';
export type PinterestConsent = 'granted' | 'denied';

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export function readPinterestConsent(storage: StorageLike): PinterestConsent | null {
  const value = storage.getItem(PINTEREST_CONSENT_KEY);
  return value === 'granted' || value === 'denied' ? value : null;
}

export function writePinterestConsent(storage: StorageLike, value: PinterestConsent): void {
  storage.setItem(PINTEREST_CONSENT_KEY, value);
}
