import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('creates an encrypted closeout and supports the core keyboard workflow', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Leave the keys where they belong.' })).toBeVisible();

  await page.getByLabel('Create a packet passphrase').fill('harbor-route-2026');
  await page.getByLabel('Confirm passphrase').fill('harbor-route-2026');
  await page.getByRole('button', { name: /Start closeout/ }).click();
  await expect(page.getByRole('heading', { name: 'Name the departure.' })).toBeVisible();

  await page.getByLabel('Project name').fill('Northwind launch');
  await page.getByLabel('Client').fill('Northwind Studio');
  await page.getByLabel('Prepared by').fill('Harbor Works');
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.getByLabel('Asset or system').fill('Production repository');
  await page.getByLabel('System-of-record link').fill('https://github.com/example/project');
  await page.getByLabel('Current owner').fill('Harbor Works');
  await page.getByLabel('Destination owner').fill('Northwind Studio');
  await page.getByRole('button', { name: /Add asset/ }).click();
  await expect(page.getByText('Production repository', { exact: true })).toBeVisible();
  await expect(page.locator('.save-state')).toHaveText('Encrypted & saved', { timeout: 5000 });

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('survives refresh and works offline after the shell is cached', async ({ page, context }) => {
  await page.goto('/');
  await page.getByLabel('Create a packet passphrase').fill('offline-harbor-2026');
  await page.getByLabel('Confirm passphrase').fill('offline-harbor-2026');
  await page.getByRole('button', { name: /Start closeout/ }).click();
  await page.getByLabel('Project name').fill('Offline closeout');
  await page.getByLabel('Client').fill('Field Client');
  await page.getByLabel('Prepared by').fill('Local Studio');
  await expect(page.locator('.save-state')).toHaveText('Encrypted & saved', { timeout: 5000 });

  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.getByLabel('Packet passphrase').fill('offline-harbor-2026');
  await page.getByRole('button', { name: /Unlock packet/ }).click();
  await expect(page.getByLabel('Project name')).toHaveValue('Offline closeout');

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText(/Offline · still saving/)).toBeVisible();
  await page.getByLabel('Packet passphrase').fill('offline-harbor-2026');
  await page.getByRole('button', { name: /Unlock packet/ }).click();
  await expect(page.getByLabel('Project name')).toHaveValue('Offline closeout');
});

test('lays out at 390px without horizontal overflow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile-specific assertion');
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
  await expect(page.getByRole('button', { name: /Start closeout/ })).toBeVisible();
});

test('completes acknowledgement and exports the client packet', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'one full export pass is sufficient');
  await page.goto('/');
  await page.getByLabel('Create a packet passphrase').fill('complete-route-2026');
  await page.getByLabel('Confirm passphrase').fill('complete-route-2026');
  await page.getByRole('button', { name: /Start closeout/ }).click();
  await page.getByLabel('Project name').fill('Acme platform handoff');
  await page.getByLabel('Client').fill('Acme Co');
  await page.getByLabel('Prepared by').fill('Harbor Works');
  await page.getByRole('button', { name: /Continue/ }).click();

  await page.getByLabel('Asset or system').fill('Production repository');
  await page.getByLabel('System-of-record link').fill('https://example.com/repository');
  await page.getByLabel('Current owner').fill('Harbor Works');
  await page.getByLabel('Destination owner').fill('Acme Co');
  await page.getByRole('button', { name: /Add asset/ }).click();
  await page.getByRole('button', { name: /Continue/ }).click();

  await page.getByLabel('Action').fill('Transfer repository ownership');
  await page.getByLabel('System').fill('Git host');
  await page.getByLabel('Responsible person').fill('Ari Client');
  await page.getByLabel('Due date').fill('2026-09-01');
  await page.getByRole('button', { name: /Add action/ }).click();
  await page.getByLabel(/I verified this change/).check();
  await page.getByRole('button', { name: 'Mark complete' }).click();
  await page.getByRole('button', { name: /Continue/ }).click();

  await page.getByLabel('Support ends').fill('2026-09-30');
  await page.getByLabel('Support contact').fill('support@example.com');
  await page.getByLabel('Included during the window').fill('Delivered-work defects and access clarification.');
  await page.getByRole('button', { name: /Continue/ }).click();

  await page.getByLabel('I received the listed assets and links.').check();
  await page.getByLabel('I understand and accept the documented ownership state.').check();
  await page.getByLabel(/credentials are exchanged separately/).check();
  await page.getByLabel('Client representative').fill('Ari Client');
  await page.getByLabel('Role').fill('Owner');
  await page.getByLabel('Acknowledgement date').fill('2026-08-28');
  await page.getByRole('button', { name: 'Record acknowledgement' }).click();
  await expect(page.getByText('Client acknowledgement recorded.')).toBeVisible();
  await page.getByRole('button', { name: /Review exports/ }).click();
  await expect(page.getByText('Acknowledged closeout')).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Download client packet/ }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('acme-platform-handoff.html');
  expect(await download.failure()).toBeNull();
});
