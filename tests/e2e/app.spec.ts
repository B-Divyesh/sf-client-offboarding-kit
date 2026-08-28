import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function readEncryptedDemoPacket(page: Page) {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('demo:closeout-kit-v1');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const envelope = await new Promise<{ salt: string; iv: string; ciphertext: string }>((resolve, reject) => {
      const request = db.transaction('encrypted-packets').objectStore('encrypted-packets').get('demo-northstar-site');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    db.close();
    const bytes = (encoded: string) => Uint8Array.from(atob(encoded), (character) => character.charCodeAt(0));
    const material = await crypto.subtle.importKey('raw', new TextEncoder().encode('sample-packet-only-2026'), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: bytes(envelope.salt), iterations: 160_000, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes(envelope.iv) }, key, bytes(envelope.ciphertext));
    return JSON.parse(new TextDecoder().decode(plaintext));
  });
}

async function openDemo(page: Page, stage = 'engagement') {
  await page.goto(`/demo?stage=${stage}`);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  const headings: Record<string, string> = {
    engagement: 'Describe the finished project.',
    assets: 'List assets and owners.',
    'access-tasks': 'Confirm account changes.',
    support: 'Set the support period.',
    acknowledgement: 'Collect the client’s receipt.',
    export: /Download the completed packet|Download a marked draft/.source
  };
  await expect(page.locator('main h1')).toContainText(new RegExp(headings[stage]));
  await expect(page.locator('h1')).toHaveCount(1);
}

const stageButton = (page: Page, label: string) => page.locator('.route').getByRole('button', { name: new RegExp(`${label}$`) });

test('@claim:demo-isolation keeps sample changes away from real packets', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Create a packet passphrase').fill('real-packet-2026');
  await page.getByLabel('Confirm passphrase').fill('real-packet-2026');
  await page.getByRole('button', { name: /Create your packet/ }).click();
  await page.getByLabel('Project name').fill('Real client project');
  await page.getByLabel('Client').fill('Real Client');
  await page.getByLabel('Prepared by').fill('Real Studio');
  await expect(page.locator('.save-state')).toHaveText('Encrypted and saved', { timeout: 5000 });

  await page.goto('/?demo=1');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByLabel('Project name')).toHaveValue('Northstar Arts website');
  await page.getByLabel('Project name').fill('Changed sample only');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByLabel('Project name')).toHaveValue('Northstar Arts website');
  await page.getByLabel('Project name').fill('Changed sample only');
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.getByLabel('Packet passphrase').fill('real-packet-2026');
  await page.getByRole('button', { name: /Unlock your packet/ }).click();
  await expect(page.getByLabel('Project name')).toHaveValue('Real client project');
  const databases = await page.evaluate(async () => (await indexedDB.databases()).map((entry) => entry.name));
  expect(databases).not.toContain('demo:closeout-kit-v1');
});

test('@claim:encrypted-storage saves only an encrypted envelope', async ({ page }) => {
  await openDemo(page);
  const stored = await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('demo:closeout-kit-v1');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const value = await new Promise<unknown>((resolve, reject) => {
      const request = db.transaction('encrypted-packets').objectStore('encrypted-packets').getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return JSON.stringify(value);
  });
  expect(stored).toContain('closeout-kit-encrypted');
  expect(stored).toContain('ciphertext');
  expect(stored).not.toContain('Northstar Arts website');
  expect(stored).not.toContain('sample-packet-only-2026');
});

test('@claim:offline-reload opens, edits, and exports the sample offline', async ({ page, context }) => {
  await openDemo(page, 'export');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText(/Offline · changes still save here/)).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Download client packet/ }).click();
  expect((await downloadPromise).suggestedFilename()).toBe('northstar-arts-website.html');
});

test('@claim:private-network keeps packet content out of every request', async ({ page }) => {
  const requests: Array<{ url: string; method: string; body: string }> = [];
  page.on('request', (request) => requests.push({ url: request.url(), method: request.method(), body: request.postData() ?? '' }));
  await openDemo(page, 'assets');
  const expectedOrigin = new URL(page.url()).origin;
  await page.getByRole('button', { name: 'Review access tasks' }).click();
  await expect(page).toHaveURL(/stage=access-tasks/);
  for (const stage of ['Support', 'Acknowledgement', 'Export']) await stageButton(page, stage).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Download client packet/ }).click();
  await downloadPromise;
  expect(requests.length).toBeGreaterThan(0);
  expect(requests.every((request) => new URL(request.url).origin === expectedOrigin)).toBe(true);
  expect(requests.every((request) => request.method === 'GET' && request.body === '')).toBe(true);
  const networkText = decodeURIComponent(requests.map((request) => `${request.url}\n${request.body}`).join('\n'));
  for (const privateValue of ['Northstar Arts website', 'Northstar Arts Council', 'Tideway Web Studio', 'sample-packet-only-2026']) {
    expect(networkText).not.toContain(privateValue);
  }
  expect(await page.locator('input[type=email], input[name*=account], input[name*=login]').count()).toBe(0);
});

test('@claim:credential-rejection preserves valid asset fields and focuses the error', async ({ page }) => {
  await openDemo(page, 'engagement');
  await page.getByLabel('Outcome summary').fill('password=client-secret-value');
  expect(await page.getByLabel('Outcome summary').evaluate((element) => (element as HTMLTextAreaElement).validity.valid)).toBe(false);
  await stageButton(page, 'Assets').click();
  await stageButton(page, 'Engagement').click();
  await expect(page.getByLabel('Outcome summary')).toHaveValue('New public website, event archive, and editor guide delivered for the autumn programme.');
  await stageButton(page, 'Assets').click();
  await page.getByLabel('Asset or system').fill('Client analytics');
  await page.getByLabel('Original service link').fill('https://example.com/analytics');
  await page.getByLabel('Current owner').fill('Tideway Web Studio');
  await page.getByLabel('Destination owner').fill('Northstar Arts Council');
  await page.getByLabel('Non-secret note').fill('api_key=abcdefghijklmnop');
  await page.getByRole('button', { name: 'Add asset' }).click();
  await expect(page.getByRole('alert')).toContainText('credential or private key');
  await expect(page.getByLabel('Asset or system')).toHaveValue('Client analytics');
  await expect(page.getByLabel('Original service link')).toHaveValue('https://example.com/analytics');
  await expect(page.getByLabel('Current owner')).toHaveValue('Tideway Web Studio');
  await expect(page.getByLabel('Destination owner')).toHaveValue('Northstar Arts Council');
  await expect(page.getByLabel('Non-secret note')).toBeFocused();

  await stageButton(page, 'Access tasks').click();
  await page.getByLabel('Access task').fill('password=client-secret-value');
  await page.getByLabel('Original service').fill('Hosting service');
  await page.getByLabel('Responsible person').fill('Maya Chen');
  await page.getByLabel('Due date').fill('2026-09-20');
  await page.getByRole('button', { name: 'Add access task' }).click();
  await expect(page.getByRole('alert')).toContainText('looks like a secret');
  await expect(page.getByLabel('Original service')).toHaveValue('Hosting service');

  await stageButton(page, 'Support').click();
  await page.getByLabel('Included during the window').fill('api_key=abcdefghijklmnop');
  expect(await page.getByLabel('Included during the window').evaluate((element) => (element as HTMLTextAreaElement).validity.valid)).toBe(false);
  await stageButton(page, 'Acknowledgement').click();
  await stageButton(page, 'Support').click();
  await expect(page.getByLabel('Included during the window')).toHaveValue('Delivered-work defects, access questions, and one editor walkthrough.');
});

test('@claim:access-confirmation blocks completion until the original service is checked', async ({ page }) => {
  await openDemo(page, 'access-tasks');
  const pendingItem = page.locator('.action-list li').filter({ hasText: 'Remove studio deployment access' });
  await pendingItem.getByRole('button', { name: 'Mark task complete' }).click();
  await expect(page.getByRole('alert')).toContainText('First confirm');
  await pendingItem.getByRole('checkbox').check();
  await pendingItem.getByRole('button', { name: 'Mark task complete' }).click();
  await expect(pendingItem.getByRole('button', { name: 'Reopen task' })).toBeVisible();
});

test('@claim:packet-export downloads every packet section', async ({ page }) => {
  await openDemo(page, 'export');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Download client packet/ }).click();
  const download = await downloadPromise;
  const path = await download.path();
  const html = await (await import('node:fs/promises')).readFile(path!, 'utf8');
  expect(html).toContain('Northstar Arts website');
  expect(html).toContain('Assets and ownership');
  expect(html).toContain('Access tasks');
  expect(html).toContain('Support window');
  expect(html).toContain('Client acknowledgement');
  expect(html).not.toMatch(/<(?:script|img|link)[^>]+(?:src|href)=["']https?:/);
});

test('@claim:backup-roundtrip restores the encrypted sample backup', async ({ page }) => {
  await openDemo(page, 'export');
  const originalPacket = await readEncryptedDemoPacket(page);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Download encrypted backup/ }).click();
  const download = await downloadPromise;
  const path = await download.path();
  await page.getByRole('button', { name: /Return to engagement/ }).click();
  await page.getByLabel('Project name').fill('Temporary edit');
  await page.waitForTimeout(700);
  await stageButton(page, 'Export').click();
  await page.locator('#import-file').setInputFiles(path!);
  await expect(page.getByRole('status')).toContainText('imported and opened');
  await expect(page.getByLabel('Project name')).toHaveValue('Northstar Arts website');
  const restoredPacket = await readEncryptedDemoPacket(page);
  expect(restoredPacket).toEqual(originalPacket);
});

test('@claim:acknowledgement-receipt exports a client form and imports its receipt', async ({ page }) => {
  await openDemo(page, 'acknowledgement');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Download client acknowledgement form/ }).click();
  const formDownload = await downloadPromise;
  const formPath = (await formDownload.path())!;
  const formHtml = await (await import('node:fs/promises')).readFile(formPath, 'utf8');
  expect(formHtml).toContain('Download acknowledgement receipt');
  expect(formHtml).toContain('not a legal e-signature');
  const executableFormPath = `${formPath}.html`;
  await (await import('node:fs/promises')).copyFile(formPath, executableFormPath);
  const { pathToFileURL } = await import('node:url');
  await page.goto(pathToFileURL(executableFormPath).href);
  for (const checkbox of await page.getByRole('checkbox').all()) await checkbox.check();
  await page.getByLabel('Your name').fill('Maya Chen');
  await page.getByLabel('Role').fill('Director');
  await page.getByLabel('Date').fill('2026-08-28');
  const receiptDownloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download acknowledgement receipt' }).click();
  const receiptPath = await (await receiptDownloadPromise).path();
  await openDemo(page, 'acknowledgement');
  await page.locator('#receipt-file').setInputFiles(receiptPath!);
  await expect(page.getByRole('status')).toContainText('receipt imported');
  await page.getByRole('button', { name: /Review exports/ }).click();
  await expect(page.getByText('Acknowledgement received')).toBeVisible();
});

test('@claim:workflow-boundaries states what must happen outside the app', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('It does not move accounts, host files, migrate a CMS, or test client access.')).toBeVisible();
  await expect(page.getByText('Complete those actions in the original hosting, domain, CMS, or account service.')).toBeVisible();
});

test('@claim:recovery-boundary has no passphrase recovery path', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await openDemo(page);
  const expectedOrigin = new URL(page.url()).origin;
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.getByLabel('Create a packet passphrase').fill('kept-by-user-2026');
  await page.getByLabel('Confirm passphrase').fill('kept-by-user-2026');
  await page.getByRole('button', { name: /Create your packet/ }).click();
  await page.getByRole('button', { name: /Lock/ }).click();
  await page.getByLabel('Packet passphrase').fill('wrong-passphrase-2026');
  await page.getByRole('button', { name: /Unlock your packet/ }).click();
  await expect(page.getByRole('alert')).toContainText('did not unlock');
  expect(requests.every((url) => new URL(url).origin === expectedOrigin)).toBe(true);
});

test('@claim:art-provenance ships the recorded original artwork', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Generated artwork')).toBeVisible();
  expect((await page.request.get('/art/harbor-closeout-960.avif')).ok()).toBe(true);
  const design = await (await import('node:fs/promises')).readFile('.factory/design.md', 'utf8');
  expect(design).toContain('Generated with the factory image deployment');
  expect(design).toContain('Production prompt');
});

test('stage URLs restore state, titles, history, focus, and announcements', async ({ page }) => {
  await openDemo(page);
  await stageButton(page, 'Assets').click();
  await expect(page).toHaveURL('/demo?stage=assets');
  await expect(page).toHaveTitle('Demo · Assets — Closeout Kit');
  await expect(page.getByRole('heading', { name: 'List assets and owners.' })).toBeFocused();
  await stageButton(page, 'Support').click();
  await page.goBack();
  await expect(page).toHaveURL('/demo?stage=assets');
  await expect(page.getByRole('heading', { name: 'List assets and owners.' })).toBeFocused();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'List assets and owners.' })).toBeVisible();
});

test('metadata, shared links, and the styled 404 are complete', async ({ page }) => {
  for (const route of ['/', '/privacy/', '/terms/', '/demo']) {
    await page.goto(route);
    await expect(page.locator('link[rel=canonical]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(page.locator('link[rel=icon]')).toHaveCount(1);
    await expect(page.locator('link[rel=apple-touch-icon]')).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Demo', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Privacy', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Terms', exact: true }).first()).toBeVisible();
  }
  await page.goto('/not-a-real-route');
  await expect(page).toHaveTitle('Page not found — Closeout Kit');
  await expect(page.getByRole('heading', { name: 'This page is not in the packet.' })).toBeVisible();
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Page not found — Closeout Kit');
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
});

test('sample provider links resolve without dead ends', async ({ page, request }) => {
  await openDemo(page, 'assets');
  const links = await page.locator('.record-main a').evaluateAll((elements) => elements.map((element) => (element as HTMLAnchorElement).href));
  expect(links).toEqual(['https://github.com/', 'https://www.netlify.com/', 'https://www.cloudflare.com/products/registrar/']);
  for (const link of links) expect((await request.get(link)).status()).toBeLessThan(400);
});

test('landing headings and workflow actions name their destinations', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Preview a filled client packet.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Create and send a packet in three steps.' })).toBeVisible();
  const actions: Record<string, string[]> = {
    engagement: ['Review assets'],
    assets: ['Edit engagement', 'Review access tasks'],
    'access-tasks': ['Review assets', 'Set support dates'],
    support: ['Review access tasks', 'Collect client receipt'],
    acknowledgement: ['Set support dates', 'Review exports'],
    export: ['Review acknowledgement', 'Return to engagement']
  };
  for (const [stage, labels] of Object.entries(actions)) {
    await openDemo(page, stage);
    await expect(page.locator('.step-actions button')).toHaveText(labels);
  }
});

test('all app routes pass serious accessibility checks and keyboard landmarks', async ({ page }) => {
  for (const stage of ['engagement', 'assets', 'access-tasks', 'support', 'acknowledgement', 'export']) {
    await openDemo(page, stage);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((issue) => ['serious', 'critical'].includes(issue.impact ?? ''))).toEqual([]);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
  }
  await page.keyboard.press('Home');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
});

test('390px layout has no overflow and keeps the complete first screen visible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Build a client closeout packet.' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Try it with sample data/ })).toBeInViewport();
  await expect(page.getByText('Encrypted before saving', { exact: true })).toBeInViewport();
  await expect(page.getByText('No account needed', { exact: true })).toBeInViewport();
  await expect(page.getByText('Works offline after the first visit', { exact: true })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await openDemo(page, 'assets');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test('390px touch targets meet the 44px baseline on every route', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const routes = ['/', '/privacy/', '/terms/', '/404.html', ...['engagement', 'assets', 'access-tasks', 'support', 'acknowledgement', 'export'].map((stage) => `/demo?stage=${stage}`)];
  for (const route of routes) {
    await page.goto(route);
    const undersized = await page.locator('a, button, summary, label:has(input[type="checkbox"]), label.file-button, label.export-card').evaluateAll((elements) => elements
      .filter((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return { label: element.getAttribute('aria-label') ?? element.textContent?.trim().slice(0, 60), width: rect.width, height: rect.height };
      })
      .filter(({ width, height }) => width < 44 || height < 44));
    expect(undersized, `${route} has undersized targets: ${JSON.stringify(undersized)}`).toEqual([]);
  }
});
