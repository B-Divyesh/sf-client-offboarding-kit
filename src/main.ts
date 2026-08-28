import './styles.css';
import { acknowledgementComplete, addHistory, completionPercent, containsSecretLike, createPacket, safeExternalUrl, today, type Packet } from './model';
import { deletePacket, decryptPacket, exportEnvelope, importEnvelope, listEnvelopes, savePacket, type EncryptedEnvelope } from './storage';
import { buildPacketHtml, downloadText, escapeHtml, filenameFor } from './exporter';
import { cachedUnlock, captureReturnedLicense, checkoutUrl, restoreLicense, storedLicense, verifyLicense } from './license';

const app = document.querySelector<HTMLDivElement>('#app')!;
const steps = ['Engagement', 'Assets', 'Access actions', 'Support', 'Acknowledge', 'Export'];
let envelopes: EncryptedEnvelope[] = [];
let unlockedPackets: Packet[] = [];
let packet: Packet | null = null;
let passphrase = '';
let step = 0;
let mode: 'loading' | 'welcome' | 'workspace' = 'loading';
let notice = '';
let noticeKind: 'info' | 'success' | 'error' = 'info';
let saveState: 'saved' | 'saving' | 'error' = 'saved';
let saveTimer = 0;
let studio = cachedUnlock();
let online = navigator.onLine;

captureReturnedLicense();

const value = (input: string) => escapeHtml(input);
const checked = (input: boolean) => (input ? ' checked' : '');

function icon(name: 'mark' | 'lock' | 'signal' | 'plus' | 'download' | 'arrow'): string {
  const paths = {
    mark: '<path d="m5 12 4 4L19 6"/>',
    lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    signal: '<path d="M4 19h16M8 19V8h8v11M12 8V4"/><circle cx="12" cy="3" r="1"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    download: '<path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14"/>',
    arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>'
  };
  return `<svg aria-hidden="true" viewBox="0 0 24 24">${paths[name]}</svg>`;
}

function showNotice(message: string, kind: typeof noticeKind = 'info'): void {
  notice = message;
  noticeKind = kind;
  render();
  window.setTimeout(() => {
    if (notice === message) {
      notice = '';
      render();
    }
  }, 5000);
}

function shell(content: string): string {
  return `<header class="topbar">
    <a class="brand" href="/" aria-label="Closeout Kit home">${icon('signal')}<span><h1>Closeout Kit</h1><small>Departure without loose ends</small></span></a>
    <div class="top-actions">
      <span class="network ${online ? '' : 'offline'}"><span aria-hidden="true"></span>${online ? 'On device' : 'Offline · still saving'}</span>
      ${packet ? `<span class="save-state" aria-live="polite">${saveState === 'saving' ? 'Saving…' : saveState === 'error' ? 'Save failed' : 'Encrypted & saved'}</span>${envelopes.length > 1 ? `<button class="quiet compact" data-action="packets">Packets · ${envelopes.length}</button>` : ''}<button class="quiet compact" data-action="lock">${icon('lock')} Lock</button>` : ''}
      <button class="quiet compact" data-action="upgrade">${studio ? 'Studio unlocked' : 'Studio · $29'}</button>
    </div>
  </header>
  ${notice ? `<div class="toast ${noticeKind}" role="status">${value(notice)}</div>` : ''}
  <main id="main">${content}</main>
  <footer><span>Private by default. No analytics. Generated artwork.</span><nav aria-label="Legal"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="https://github.com/B-Divyesh/sf-client-offboarding-kit" rel="noreferrer">Source</a></nav></footer>
  ${upgradeDialog()}${packetLibraryDialog()}`;
}

function loadingView(): string {
  return shell('<section class="loading-state" aria-live="polite"><span class="beacon"></span><h2>Opening the workbench…</h2><p>Your local encrypted packets are being checked.</p></section>');
}

function welcomeView(): string {
  const hasPackets = envelopes.length > 0;
  return shell(`<section class="welcome">
    <picture class="harbor-scene">
      <source media="(max-width: 700px)" srcset="/art/harbor-closeout-960.webp">
      <img src="/art/harbor-closeout-1536.webp" width="1536" height="1024" alt="A quiet harbor seen from a dark operations room, with a closed document case ready for handoff" fetchpriority="high" decoding="async">
    </picture>
    <div class="welcome-copy">
      <span class="eyebrow">Local-first closeout workspace</span>
      <h2>${hasPackets ? 'Your packet is secured.' : 'Leave the keys where they belong.'}</h2>
      <p>${hasPackets ? 'Enter the passphrase used for this browser’s encrypted packet. Closeout Kit never sends it anywhere.' : 'Map assets, ownership, access actions, support, and acknowledgement—then hand over one portable packet. Credentials stay in their proper vaults.'}</p>
      <form id="access-form" class="access-form">
        <label for="passphrase">${hasPackets ? 'Packet passphrase' : 'Create a packet passphrase'}</label>
        <div class="field-with-action"><input id="passphrase" name="passphrase" type="password" minlength="10" autocomplete="${hasPackets ? 'current-password' : 'new-password'}" required><button class="primary" type="submit">${hasPackets ? 'Unlock packet' : 'Start closeout'} ${icon('arrow')}</button></div>
        ${hasPackets ? '' : '<label for="confirm-passphrase">Confirm passphrase</label><input id="confirm-passphrase" name="confirmPassphrase" type="password" minlength="10" autocomplete="new-password" required>'}
        <p class="field-help">At least 10 characters. There is no recovery service because nothing leaves this device.</p>
      </form>
      <div class="trust-row"><span>${icon('lock')} AES-GCM encrypted</span><span>No client account</span><span>Works offline</span></div>
    </div>
  </section>
  <section class="welcome-lower" aria-labelledby="route-heading"><div><span class="eyebrow">The closeout route</span><h2 id="route-heading">One clear record, six deliberate stages.</h2></div><ol>${steps.map((label, index) => `<li><b>${String(index + 1).padStart(2, '0')}</b>${label}</li>`).join('')}</ol></section>`);
}

function routeRail(): string {
  if (!packet) return '';
  const percent = completionPercent(packet);
  return `<aside class="route" aria-label="Closeout route"><div class="route-heading"><span class="eyebrow">Closeout route</span><strong>${percent}% ready</strong><div class="progress" role="progressbar" aria-label="Packet completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><span style="width:${percent}%"></span></div></div><ol>${steps.map((label, index) => `<li><button data-step="${index}" class="${step === index ? 'current' : ''}"><span>${index < step ? '✓' : String(index + 1).padStart(2, '0')}</span>${label}</button></li>`).join('')}</ol><div class="rail-note">${icon('lock')}<p><strong>Secrets stay out.</strong> Link to vault items or system records; never paste credentials.</p></div></aside>`;
}

function workspaceView(): string {
  return shell(`<div class="workbench">${routeRail()}<section class="stage" aria-live="polite">${stageView()}</section></div>`);
}

function stageHeader(kicker: string, title: string, description: string): string {
  return `<header class="stage-header"><span class="eyebrow">${kicker}</span><h2>${title}</h2><p>${description}</p></header>`;
}

function inputField(label: string, field: string, current: string, options: { type?: string; required?: boolean; help?: string; placeholder?: string } = {}): string {
  const id = `field-${field.replace(/\./g, '-')}`;
  return `<label class="field" for="${id}"><span>${label}${options.required ? ' <b aria-hidden="true">*</b>' : ''}</span><input id="${id}" data-field="${field}" value="${value(current)}" type="${options.type ?? 'text'}" ${options.required ? 'required' : ''} ${options.placeholder ? `placeholder="${value(options.placeholder)}"` : ''}>${options.help ? `<small>${options.help}</small>` : ''}</label>`;
}

function textArea(label: string, field: string, current: string, help = ''): string {
  const id = `field-${field.replace(/\./g, '-')}`;
  return `<label class="field" for="${id}"><span>${label}</span><textarea id="${id}" data-field="${field}" rows="4">${value(current)}</textarea>${help ? `<small>${help}</small>` : ''}</label>`;
}

function stepActions(back = true, nextLabel = 'Continue'): string {
  return `<div class="step-actions">${back ? '<button class="quiet" data-action="back">Back</button>' : '<span></span>'}<button class="primary" data-action="next">${nextLabel} ${icon('arrow')}</button></div>`;
}

function engagementStage(p: Packet): string {
  return `${stageHeader('Stage 01 · Engagement', 'Name the departure.', 'Set the plain-language context your client will see at the top of the packet.')}
    <div class="form-grid">${inputField('Project name', 'projectName', p.projectName, { required: true, placeholder: 'Northwind website rebuild' })}${inputField('Client', 'clientName', p.clientName, { required: true, placeholder: 'Northwind Studio' })}${inputField('Prepared by', 'preparedBy', p.preparedBy, { required: true, placeholder: 'Your name or studio' })}${inputField('Closeout date', 'closeoutDate', p.closeoutDate, { type: 'date', required: true })}</div>
    ${textArea('Outcome summary', 'summary', p.summary, 'Describe what was delivered and the operator outcome. Do not include secrets.')}${stepActions(false)}`;
}

function assetsStage(p: Packet): string {
  return `${stageHeader('Stage 02 · Assets', 'Point to every system of record.', 'List what exists, where it lives, and who should own it after closeout. Links must use HTTPS.')}
  <div class="security-callout">${icon('lock')}<div><strong>No credential fields—by design.</strong><p>Use a vault sharing link if needed. Closeout Kit rejects common secret and private-key patterns.</p></div></div>
  <form id="asset-form" class="entry-form"><div class="form-grid"><label class="field"><span>Asset or system *</span><input name="name" required placeholder="Production repository"></label><label class="field"><span>Type *</span><select name="kind" required><option>Source code</option><option>Hosting</option><option>Domain & DNS</option><option>CMS</option><option>Analytics</option><option>Design files</option><option>Documentation</option><option>Other</option></select></label><label class="field wide"><span>System-of-record link</span><input name="url" type="url" inputmode="url" placeholder="https://…"><small>HTTPS only; a sign-in or vault-item link is fine.</small></label><label class="field"><span>Current owner *</span><input name="currentOwner" required></label><label class="field"><span>Destination owner *</span><input name="destinationOwner" required></label><label class="field wide"><span>Non-secret note</span><textarea name="note" rows="2" placeholder="Repository includes deployment runbook in /docs"></textarea></label></div><button class="secondary" type="submit">${icon('plus')} Add asset</button></form>
  <div class="records"><div class="records-title"><h3>Recorded assets</h3><span>${p.assets.length}</span></div>${p.assets.length ? `<ul>${p.assets.map((a) => `<li><div class="record-main"><span class="record-type">${value(a.kind)}</span><strong>${value(a.name)}</strong><p>${value(a.currentOwner)} <span aria-hidden="true">→</span> ${value(a.destinationOwner)}</p>${a.url ? `<a href="${value(a.url)}" target="_blank" rel="noreferrer">Open system record <span aria-hidden="true">↗</span></a>` : ''}</div><button class="icon-button danger" data-delete-asset="${a.id}" aria-label="Remove ${value(a.name)}">Remove</button></li>`).join('')}</ul>` : '<div class="empty"><span>02 / empty waters</span><p>No assets yet. Start with the production repository, hosting, and domain.</p></div>'}</div>${stepActions()}`;
}

function actionsStage(p: Packet): string {
  return `${stageHeader('Stage 03 · Access actions', 'Make ownership change hands.', 'Record the transfer or revoke work, then confirm each action only after checking the external system.')}
  <form id="action-form" class="entry-form"><div class="form-grid"><label class="field wide"><span>Action *</span><input name="action" required placeholder="Transfer organization ownership to client admin"></label><label class="field"><span>System *</span><input name="system" required placeholder="GitHub"></label><label class="field"><span>Responsible person *</span><input name="responsible" required></label><label class="field"><span>Due date *</span><input name="due" type="date" required></label></div><button class="secondary" type="submit">${icon('plus')} Add action</button></form>
  <div class="records"><div class="records-title"><h3>Transfer log</h3><span>${p.actions.filter((a) => a.status === 'complete').length}/${p.actions.length} confirmed</span></div>${p.actions.length ? `<ul class="action-list">${p.actions.map((a) => `<li class="${a.status === 'complete' ? 'done' : ''}"><div class="record-main"><span class="record-type">${value(a.system)} · due ${value(a.due)}</span><strong>${value(a.action)}</strong><p>Responsible: ${value(a.responsible)}</p><label class="confirm-line"><input type="checkbox" data-confirm-action="${a.id}"${checked(a.confirmedExternal)}> I verified this change in ${value(a.system)}</label></div><div class="record-actions"><button class="small ${a.status === 'complete' ? 'quiet' : 'secondary'}" data-toggle-action="${a.id}">${a.status === 'complete' ? 'Reopen' : 'Mark complete'}</button><button class="icon-button danger" data-delete-action="${a.id}" aria-label="Remove ${value(a.action)}">Remove</button></div></li>`).join('')}</ul>` : '<div class="empty"><span>03 / awaiting orders</span><p>Add every ownership transfer, account invitation, and former-contributor revocation.</p></div>'}</div>${stepActions()}`;
}

function supportStage(p: Packet): string {
  return `${stageHeader('Stage 04 · Support', 'Draw a visible shoreline.', 'Define when transition support starts and ends, how to reach you, and what belongs inside the window.')}
  <div class="form-grid">${inputField('Support starts', 'support.starts', p.support.starts, { type: 'date', required: true })}${inputField('Support ends', 'support.ends', p.support.ends, { type: 'date', required: true })}${inputField('Support contact', 'support.contact', p.support.contact, { required: true, placeholder: 'support@example.com' })}<label class="field"><span>Primary channel</span><select data-field="support.channel"><option${p.support.channel === 'Email' ? ' selected' : ''}>Email</option><option${p.support.channel === 'Client portal' ? ' selected' : ''}>Client portal</option><option${p.support.channel === 'Shared chat' ? ' selected' : ''}>Shared chat</option><option${p.support.channel === 'Phone' ? ' selected' : ''}>Phone</option></select></label></div>
  ${textArea('Included during the window', 'support.included', p.support.included, 'Example: production defects in delivered work, access clarification, one operator walkthrough.')}${textArea('Outside the window / new work', 'support.excluded', p.support.excluded, 'Example: feature requests, vendor outages, content changes, and third-party subscription costs.')}${stepActions()}`;
}

function acknowledgementStage(p: Packet): string {
  const blockers = [p.assets.length ? '' : 'Add at least one asset.', p.actions.length ? '' : 'Add at least one access action.', p.actions.every((a) => a.status === 'complete' && a.confirmedExternal) ? '' : 'Confirm every external access action.', p.support.ends ? '' : 'Set the support end date.'].filter(Boolean);
  return `${stageHeader('Stage 05 · Acknowledge', 'Ask for an explicit receipt.', 'The client should review this screen with you. Their typed name records acknowledgement; it is not a legal e-signature.')}
  ${blockers.length ? `<div class="readiness"><strong>Before acknowledgement</strong><ul>${blockers.map((item) => `<li>${item}</li>`).join('')}</ul></div>` : '<div class="readiness ready">✓ Ownership and support records are ready for client review.</div>'}
  <div class="ack-box"><label><input type="checkbox" data-field="acknowledgement.received"${checked(p.acknowledgement.received)}> I received the listed assets and links.</label><label><input type="checkbox" data-field="acknowledgement.ownership"${checked(p.acknowledgement.ownership)}> I understand and accept the documented ownership state.</label><label><input type="checkbox" data-field="acknowledgement.noSecrets"${checked(p.acknowledgement.noSecrets)}> I understand credentials are exchanged separately through secure systems.</label><div class="form-grid">${inputField('Client representative', 'acknowledgement.signer', p.acknowledgement.signer, { required: true })}${inputField('Role', 'acknowledgement.role', p.acknowledgement.role)}${inputField('Acknowledgement date', 'acknowledgement.signedAt', p.acknowledgement.signedAt, { type: 'date', required: true })}</div><button class="primary" data-action="acknowledge">${acknowledgementComplete(p) ? 'Update acknowledgement' : 'Record acknowledgement'}</button></div>
  <details class="history"><summary>Packet history (${p.history.length})</summary><ol>${p.history.map((event) => `<li><time datetime="${event.at}">${new Date(event.at).toLocaleString()}</time>${value(event.label)}</li>`).join('')}</ol></details>${stepActions(true, 'Review exports')}`;
}

function exportStage(p: Packet): string {
  const complete = acknowledgementComplete(p);
  return `${stageHeader('Stage 06 · Export', complete ? 'The packet is ready to leave.' : 'Export a clearly marked draft.', 'Download a standalone HTML packet for the client, print it to PDF, and keep an encrypted backup you control.')}
  <div class="departure ${complete ? 'complete' : ''}"><span class="departure-mark">${complete ? '✓' : '!'}</span><div><span class="eyebrow">${complete ? 'Acknowledged closeout' : 'Acknowledgement pending'}</span><h3>${value(p.projectName || 'Untitled project')}</h3><p>${p.assets.length} assets · ${p.actions.filter((a) => a.status === 'complete').length}/${p.actions.length} actions confirmed · Support through ${value(p.support.ends || 'not set')}</p></div></div>
  <div class="export-grid"><button class="export-card" data-action="export-html">${icon('download')}<span><strong>Download client packet</strong><small>Standalone HTML · opens anywhere</small></span></button><button class="export-card" data-action="print">${icon('download')}<span><strong>Print / save PDF</strong><small>Uses your browser’s print dialog</small></span></button><button class="export-card" data-action="export-backup">${icon('lock')}<span><strong>Encrypted backup</strong><small>JSON · requires your passphrase</small></span></button><label class="export-card file-card">${icon('plus')}<span><strong>Import encrypted backup</strong><small>Restores a JSON packet</small></span><input id="import-file" type="file" accept="application/json,.json"></label></div>
  <section class="studio-panel"><div><span class="eyebrow">Studio license · one-time $29</span><h3>Reuse your closeout system.</h3><p>Unlock unlimited packets, duplication, and client-facing brand details on this device. Core packet export and encrypted backups always stay free.</p></div>${studio ? `<div class="studio-tools"><div class="form-grid">${inputField('Studio name on exports', 'brand.name', p.brand.name)}${inputField('Accent color', 'brand.color', p.brand.color, { type: 'color' })}</div><div class="inline-actions"><button class="secondary" data-action="duplicate">Duplicate packet</button><button class="secondary" data-action="new-packet">New packet</button></div></div>` : `<button class="primary" data-action="upgrade">Unlock Studio</button>`}</section>
  <div class="danger-zone"><div><strong>Delete local packet</strong><p>Export a backup first. This cannot be undone.</p></div><button class="danger-button" data-action="delete-packet">Delete packet</button></div>${stepActions(true, 'Back to engagement')}`;
}

function stageView(): string {
  if (!packet) return '';
  return [engagementStage, assetsStage, actionsStage, supportStage, acknowledgementStage, exportStage][step](packet);
}

function upgradeDialog(): string {
  return `<dialog id="upgrade-dialog"><button class="dialog-close" data-action="close-upgrade" aria-label="Close license dialog">×</button><span class="eyebrow">Closeout Kit Studio</span><h2>${studio ? 'Studio is unlocked.' : 'Reuse a calmer closeout.'}</h2><p>One-time <strong>$29</strong>. Add unlimited local packets, duplicate a proven closeout, and put your studio name and accent on client exports. No subscription.</p>${studio ? '<p class="success-copy">✓ License active on this browser.</p>' : `<a class="primary button-link" href="${checkoutUrl}">Buy Studio securely</a><p class="merchant">Checkout and refunds are handled by Sociobot / Dodo, the merchant of record.</p><form id="license-form"><label class="field" for="license-token"><span>Have a license? Paste it</span><input id="license-token" name="license" autocomplete="off" required></label><button class="secondary" type="submit">Verify license</button></form>`}<p class="legal-links"><a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a></p></dialog>`;
}

function packetLibraryDialog(): string {
  if (!packet) return '';
  return `<dialog id="packet-dialog"><button class="dialog-close" data-action="close-packets" aria-label="Close packet list">×</button><span class="eyebrow">Encrypted on this device</span><h2>Your packets</h2><p>Every packet below was decrypted only for this unlocked session.</p><ul class="packet-list">${unlockedPackets.map((item) => `<li class="${item.id === packet?.id ? 'active' : ''}"><button data-open-packet="${item.id}"><strong>${value(item.projectName || 'Untitled packet')}</strong><small>${value(item.clientName || 'No client yet')} · updated ${new Date(item.updatedAt).toLocaleDateString()}</small></button></li>`).join('')}</ul>${studio ? '<button class="secondary" data-action="new-packet">+ New packet</button>' : '<p class="merchant">Studio adds new packets and duplication. Existing packets always remain accessible.</p>'}</dialog>`;
}

function render(): void {
  const focused = document.activeElement instanceof HTMLElement ? document.activeElement.id : '';
  app.innerHTML = mode === 'loading' ? loadingView() : mode === 'welcome' ? welcomeView() : workspaceView();
  if (focused) document.getElementById(focused)?.focus({ preventScroll: true });
}

function setNestedField(root: Packet, path: string, input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): void {
  const parts = path.split('.');
  let target: Record<string, unknown> = root as unknown as Record<string, unknown>;
  for (const part of parts.slice(0, -1)) target = target[part] as Record<string, unknown>;
  target[parts.at(-1)!] = input instanceof HTMLInputElement && input.type === 'checkbox' ? input.checked : input.value;
  root.updatedAt = new Date().toISOString();
}

function queueSave(): void {
  if (!packet || !passphrase) return;
  saveState = 'saving';
  const status = document.querySelector('.save-state');
  if (status) status.textContent = 'Saving…';
  const currentPacket = packet;
  clearTimeout(saveTimer);
  saveTimer = window.setTimeout(async () => {
    try {
      await savePacket(currentPacket, passphrase);
      envelopes = await listEnvelopes();
      saveState = 'saved';
      const savedStatus = document.querySelector('.save-state');
      if (savedStatus) savedStatus.textContent = 'Encrypted & saved';
    } catch (error) {
      saveState = 'error';
      showNotice(error instanceof Error ? error.message : 'The packet could not be saved.', 'error');
    }
    if (saveState === 'error') render();
  }, 500);
}

function validEngagement(): boolean {
  if (!packet) return false;
  if (step === 0 && (!packet.projectName.trim() || !packet.clientName.trim() || !packet.preparedBy.trim())) {
    showNotice('Add the project, client, and preparer before continuing.', 'error');
    return false;
  }
  return true;
}

async function startOrUnlock(form: HTMLFormElement): Promise<void> {
  const data = new FormData(form);
  const entered = String(data.get('passphrase') ?? '');
  if (entered.length < 10) return showNotice('Use at least 10 characters for the packet passphrase.', 'error');
  if (!envelopes.length) {
    if (entered !== String(data.get('confirmPassphrase') ?? '')) return showNotice('The passphrases do not match.', 'error');
    passphrase = entered;
    packet = createPacket();
    await savePacket(packet, passphrase);
    unlockedPackets = [packet];
  } else {
    try {
      packet = await decryptPacket(envelopes[0], entered);
      passphrase = entered;
      unlockedPackets = [];
      for (const envelope of envelopes) {
        try { unlockedPackets.push(await decryptPacket(envelope, entered)); } catch { /* A separately encrypted import stays unavailable. */ }
      }
    } catch {
      return showNotice('That passphrase did not unlock the packet. Try again or import a backup.', 'error');
    }
  }
  mode = 'workspace';
  step = 0;
  render();
}

app.addEventListener('submit', async (event) => {
  const form = event.target as HTMLFormElement;
  event.preventDefault();
  if (form.id === 'access-form') return startOrUnlock(form);
  if (form.id === 'asset-form' && packet) {
    const data = Object.fromEntries(new FormData(form));
    const fields = Object.values(data).map(String);
    if (fields.some(containsSecretLike)) return showNotice('That looks like a credential or private key. Add a secure system link instead.', 'error');
    if (!safeExternalUrl(String(data.url))) return showNotice('System-of-record links must be complete HTTPS addresses.', 'error');
    packet.assets.push({ id: crypto.randomUUID(), name: String(data.name), kind: String(data.kind), url: String(data.url), currentOwner: String(data.currentOwner), destinationOwner: String(data.destinationOwner), note: String(data.note) });
    addHistory(packet, `Asset added: ${String(data.name)}`);
    packet.updatedAt = new Date().toISOString(); queueSave(); render(); return;
  }
  if (form.id === 'action-form' && packet) {
    const data = Object.fromEntries(new FormData(form));
    if (Object.values(data).map(String).some(containsSecretLike)) return showNotice('That entry looks like a secret. Describe the action without credentials.', 'error');
    packet.actions.push({ id: crypto.randomUUID(), action: String(data.action), system: String(data.system), responsible: String(data.responsible), due: String(data.due), status: 'pending', confirmedExternal: false });
    addHistory(packet, `Access action added: ${String(data.action)}`);
    packet.updatedAt = new Date().toISOString(); queueSave(); render(); return;
  }
  if (form.id === 'license-form') {
    const token = String(new FormData(form).get('license') ?? '').trim();
    if (!token) return;
    restoreLicense(token);
    try {
      studio = await verifyLicense(true);
      showNotice(studio ? 'Studio license verified.' : 'That license is not active for Closeout Kit.', studio ? 'success' : 'error');
    } catch {
      showNotice('License verification is unavailable. Your free workspace still works.', 'error');
    }
  }
});

app.addEventListener('input', (event) => {
  const input = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  const field = input.dataset.field;
  if (!field || !packet) return;
  if (typeof input.value === 'string' && containsSecretLike(input.value)) {
    input.setCustomValidity('Do not store credentials here. Use a secure system link.');
    input.reportValidity();
    return;
  }
  input.setCustomValidity('');
  setNestedField(packet, field, input);
  queueSave();
});

app.addEventListener('change', async (event) => {
  const input = event.target as HTMLInputElement;
  if (input.id === 'import-file' && input.files?.[0] && passphrase) {
    try {
      const parsed: unknown = JSON.parse(await input.files[0].text());
      packet = await importEnvelope(parsed, passphrase);
      envelopes = await listEnvelopes();
      unlockedPackets = [packet, ...unlockedPackets.filter((item) => item.id !== packet?.id)];
      step = 0;
      showNotice('Encrypted packet imported and opened.', 'success');
    } catch (error) {
      showNotice(error instanceof Error ? error.message : 'The backup could not be imported.', 'error');
    }
  }
  if (input.dataset.confirmAction && packet) {
    const action = packet.actions.find((item) => item.id === input.dataset.confirmAction);
    if (action) { action.confirmedExternal = input.checked; if (!input.checked) action.status = 'pending'; queueSave(); render(); }
  }
});

app.addEventListener('click', async (event) => {
  const target = (event.target as HTMLElement).closest<HTMLElement>('[data-action], [data-step], [data-delete-asset], [data-delete-action], [data-toggle-action], [data-open-packet]');
  if (!target) return;
  if (target.dataset.step) { step = Number(target.dataset.step); render(); document.querySelector('.stage-header')?.scrollIntoView(); return; }
  if (!packet && !['upgrade', 'close-upgrade'].includes(target.dataset.action ?? '')) return;
  const action = target.dataset.action;
  if (target.dataset.openPacket) { const selected = unlockedPackets.find((item) => item.id === target.dataset.openPacket); if (selected) { packet = selected; step = 0; (document.querySelector('#packet-dialog') as HTMLDialogElement)?.close(); render(); } }
  if (action === 'next') { if (!validEngagement()) return; step = step === 5 ? 0 : Math.min(5, step + 1); render(); document.querySelector('.stage-header')?.scrollIntoView(); }
  if (action === 'back') { step = Math.max(0, step - 1); render(); }
  if (action === 'lock') { clearTimeout(saveTimer); if (packet && passphrase) await savePacket(packet, passphrase); packet = null; passphrase = ''; mode = 'welcome'; render(); }
  if (action === 'upgrade') (document.querySelector('#upgrade-dialog') as HTMLDialogElement)?.showModal();
  if (action === 'close-upgrade') (document.querySelector('#upgrade-dialog') as HTMLDialogElement)?.close();
  if (action === 'packets') (document.querySelector('#packet-dialog') as HTMLDialogElement)?.showModal();
  if (action === 'close-packets') (document.querySelector('#packet-dialog') as HTMLDialogElement)?.close();
  if (target.dataset.deleteAsset && packet) {
    const asset = packet.assets.find((item) => item.id === target.dataset.deleteAsset);
    if (asset && confirm(`Remove “${asset.name}” from this packet?`)) { packet.assets = packet.assets.filter((item) => item.id !== asset.id); addHistory(packet, `Asset removed: ${asset.name}`); queueSave(); render(); }
  }
  if (target.dataset.deleteAction && packet) {
    const item = packet.actions.find((entry) => entry.id === target.dataset.deleteAction);
    if (item && confirm(`Remove “${item.action}” from the transfer log?`)) { packet.actions = packet.actions.filter((entry) => entry.id !== item.id); addHistory(packet, `Access action removed: ${item.action}`); queueSave(); render(); }
  }
  if (target.dataset.toggleAction && packet) {
    const item = packet.actions.find((entry) => entry.id === target.dataset.toggleAction);
    if (item) {
      if (item.status === 'pending' && !item.confirmedExternal) return showNotice(`First confirm that you verified this change in ${item.system}.`, 'error');
      item.status = item.status === 'complete' ? 'pending' : 'complete';
      addHistory(packet, `${item.status === 'complete' ? 'Confirmed' : 'Reopened'}: ${item.action}`); queueSave(); render();
    }
  }
  if (action === 'acknowledge' && packet) {
    const a = packet.acknowledgement;
    if (!a.received || !a.ownership || !a.noSecrets || !a.signer.trim() || !a.signedAt) return showNotice('Complete all three confirmations, representative, and date.', 'error');
    addHistory(packet, `Acknowledged by ${a.signer}`); queueSave(); showNotice('Client acknowledgement recorded.', 'success');
  }
  if (action === 'export-html' && packet) { downloadText(filenameFor(packet, 'html'), buildPacketHtml(packet), 'text/html'); addHistory(packet, 'Client HTML packet exported'); queueSave(); }
  if (action === 'print' && packet) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return showNotice('Allow pop-ups to open the print-ready packet.', 'error');
    printWindow.document.write(buildPacketHtml(packet)); printWindow.document.close(); printWindow.addEventListener('load', () => printWindow.print());
  }
  if (action === 'export-backup' && packet) {
    const envelope = await exportEnvelope(packet.id);
    if (envelope) downloadText(filenameFor(packet, 'closeout.json'), JSON.stringify(envelope, null, 2), 'application/json');
  }
  if (action === 'duplicate' && packet && studio) {
    const copy = structuredClone(packet); copy.id = crypto.randomUUID(); copy.projectName = `${packet.projectName} copy`; copy.acknowledgement = { received: false, ownership: false, noSecrets: false, signer: '', role: '', signedAt: '' }; copy.createdAt = new Date().toISOString(); copy.updatedAt = copy.createdAt; copy.history = [{ at: copy.createdAt, label: `Duplicated from ${packet.projectName}` }]; packet = copy; step = 0; await savePacket(packet, passphrase); envelopes = await listEnvelopes(); unlockedPackets.unshift(packet); showNotice('Packet duplicated. Update the engagement details.', 'success');
  }
  if (action === 'new-packet' && studio) { packet = createPacket(); step = 0; await savePacket(packet, passphrase); envelopes = await listEnvelopes(); unlockedPackets.unshift(packet); render(); }
  if (action === 'delete-packet' && packet) {
    const name = packet.projectName || 'Untitled packet';
    if (confirm(`Permanently delete “${name}” from this device? Export a backup first if you may need it.`)) { await deletePacket(packet.id); envelopes = await listEnvelopes(); unlockedPackets = unlockedPackets.filter((item) => item.id !== packet?.id); packet = null; passphrase = ''; mode = 'welcome'; render(); }
  }
});

window.addEventListener('online', () => { online = true; render(); });
window.addEventListener('offline', () => { online = false; render(); });

async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    const offerUpdate = () => {
      notice = 'A new version is ready. Reload to update.';
      noticeKind = 'info'; render();
    };
    if (registration.waiting) offerUpdate();
    registration.addEventListener('updatefound', () => registration.installing?.addEventListener('statechange', () => {
      if (registration.waiting && navigator.serviceWorker.controller) offerUpdate();
    }));
  } catch { /* The app remains fully usable without install support. */ }
}

async function init(): Promise<void> {
  render();
  try { envelopes = await listEnvelopes(); } catch (error) { showNotice(error instanceof Error ? error.message : 'Local storage is unavailable.', 'error'); }
  mode = 'welcome'; render();
  if (storedLicense()) {
    verifyLicense().then((valid) => { studio = valid; render(); }).catch(() => { /* cached verdict keeps first paint usable */ });
  }
  registerServiceWorker();
}

init();
