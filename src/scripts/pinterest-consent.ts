export const PINTEREST_CONSENT_KEY = 'stackgeist:pinterest-consent';
export type PinterestConsent = 'granted' | 'denied';

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export function readPinterestConsent(storage?: StorageLike): PinterestConsent | null {
  try {
    const value = (storage ?? window.localStorage).getItem(PINTEREST_CONSENT_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

export function writePinterestConsent(storage: StorageLike | undefined, value: PinterestConsent): boolean {
  try {
    (storage ?? window.localStorage).setItem(PINTEREST_CONSENT_KEY, value);
    return true;
  } catch {
    return false;
  }
}
