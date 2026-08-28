const SLUG = 'client-offboarding-kit';
const API = 'https://api.sociobot.in/api/v1';
const LICENSE_KEY = `sb_license:${SLUG}`;
const VERDICT_KEY = `sb_license_verdict:${SLUG}`;
const DAY = 86_400_000;

export const checkoutUrl = `${API}/products/${SLUG}/checkout`;

type Verdict = { valid: boolean; checkedAt: number };

export function captureReturnedLicense(): void {
  const url = new URL(location.href);
  const license = url.searchParams.get('license');
  if (!license) return;
  localStorage.setItem(LICENSE_KEY, license.trim());
  localStorage.removeItem(VERDICT_KEY);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function storedLicense(): string {
  return localStorage.getItem(LICENSE_KEY) ?? '';
}

export function cachedUnlock(): boolean {
  try {
    const verdict = JSON.parse(localStorage.getItem(VERDICT_KEY) ?? '') as Verdict;
    return verdict.valid === true;
  } catch {
    return false;
  }
}

export function restoreLicense(token: string): void {
  localStorage.setItem(LICENSE_KEY, token.trim());
  localStorage.removeItem(VERDICT_KEY);
}

export async function verifyLicense(force = false): Promise<boolean> {
  const license = storedLicense();
  if (!license) return false;
  try {
    const cached = JSON.parse(localStorage.getItem(VERDICT_KEY) ?? '') as Verdict;
    if (!force && Date.now() - cached.checkedAt < DAY) return cached.valid;
  } catch { /* no cached verdict */ }
  const response = await fetch(`${API}/products/${SLUG}/verify?license=${encodeURIComponent(license)}`);
  if (!response.ok) throw new Error('License verification is temporarily unavailable.');
  const data = (await response.json()) as { valid: boolean };
  localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: data.valid, checkedAt: Date.now() } satisfies Verdict));
  return data.valid;
}
