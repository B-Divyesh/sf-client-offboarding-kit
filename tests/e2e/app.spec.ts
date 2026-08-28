import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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

test('@claim:private-network uses no account, analytics, or cross-origin request', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await openDemo(page, 'assets');
  await page.getByRole('button', { name: /Continue/ }).click();
  await expect(page).toHaveURL(/stage=access-tasks/);
  expect(requests.length).toBeGreaterThan(0);
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
  expect(await page.locator('input[type=email], input[name*=account], input[name*=login]').count()).toBe(0);
});

test('@claim:credential-rejection preserves valid asset fields and focuses the error', async ({ page }) => {
  await openDemo(page, 'engagement');
  await page.getByLabel('Outcome summary').fill('password=client-secret-value');
  expect(await page.getByLabel('Outcome summary').evaluate((element) => (element as HTMLTextAreaElement).validity.valid)).toBe(false);
  await page.getByRole('button', { name: 'Assets' }).click();
  await page.getByRole('button', { name: 'Engagement' }).click();
  await expect(page.getByLabel('Outcome summary')).toHaveValue('New public website, event archive, and editor guide delivered for the autumn programme.');
  await page.getByRole('button', { name: 'Assets' }).click();
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

  await page.getByRole('button', { name: 'Access tasks' }).click();
  await page.getByLabel('Access task').fill('password=client-secret-value');
  await page.getByLabel('Original service').fill('Hosting service');
  await page.getByLabel('Responsible person').fill('Maya Chen');
  await page.getByLabel('Due date').fill('2026-09-20');
  await page.getByRole('button', { name: 'Add access task' }).click();
  await expect(page.getByRole('alert')).toContainText('looks like a secret');
  await expect(page.getByLabel('Original service')).toHaveValue('Hosting service');

  await page.getByRole('button', { name: 'Support' }).click();
  await page.getByLabel('Included during the window').fill('api_key=abcdefghijklmnop');
  expect(await page.getByLabel('Included during the window').evaluate((element) => (element as HTMLTextAreaElement).validity.valid)).toBe(false);
  await page.getByRole('button', { name: 'Acknowledgement' }).click();
  await page.getByRole('button', { name: 'Support' }).click();
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
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Download encrypted backup/ }).click();
  const download = await downloadPromise;
  const path = await download.path();
  await page.getByRole('button', { name: /Return to engagement/ }).click();
  await page.getByLabel('Project name').fill('Temporary edit');
  await page.getByRole('button', { name: 'Export' }).click();
  await page.locator('#import-file').setInputFiles(path!);
  await expect(page.getByRole('status')).toContainText('imported and opened');
  await expect(page.getByLabel('Project name')).toHaveValue('Northstar Arts website');
});

test('@claim:acknowledgement-receipt exports a client form and imports its receipt', async ({ page }) => {
  await openDemo(page, 'acknowledgement');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Download client acknowledgement form/ }).click();
  const formDownload = await downloadPromise;
  const formHtml = await (await import('node:fs/promises')).readFile((await formDownload.path())!, 'utf8');
  expect(formHtml).toContain('Download acknowledgement receipt');
  expect(formHtml).toContain('not a legal e-signature');
  await page.locator('#receipt-file').setInputFiles({ name: 'northstar-receipt.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ format: 'closeout-kit-acknowledgement', version: 1, packetId: 'demo-northstar-site', projectName: 'Northstar Arts website', received: true, ownership: true, noSecrets: true, signer: 'Maya Chen', role: 'Director', signedAt: '2026-08-28' })) });
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
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.getByLabel('Create a packet passphrase').fill('kept-by-user-2026');
  await page.getByLabel('Confirm passphrase').fill('kept-by-user-2026');
  await page.getByRole('button', { name: /Create your packet/ }).click();
  await page.getByRole('button', { name: /Lock/ }).click();
  await page.getByLabel('Packet passphrase').fill('wrong-passphrase-2026');
  await page.getByRole('button', { name: /Unlock your packet/ }).click();
  await expect(page.getByRole('alert')).toContainText('did not unlock');
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
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
  await page.getByRole('button', { name: 'Assets' }).click();
  await expect(page).toHaveURL('/demo?stage=assets');
  await expect(page).toHaveTitle('Demo · Assets — Closeout Kit');
  await expect(page.getByRole('heading', { name: 'List assets and owners.' })).toBeFocused();
  await page.getByRole('button', { name: 'Support' }).click();
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

test('390px layout has no overflow and keeps the sample action on the first screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Build a client closeout packet.' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Try it with sample data/ })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await openDemo(page, 'assets');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});
