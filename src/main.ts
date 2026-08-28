import './styles.css';
import { acknowledgementComplete, addHistory, completionPercent, containsSecretLike, createDemoPacket, createPacket, safeExternalUrl, validateAcknowledgementReceipt, type Packet } from './model';
import { clearDemoStorage, configureStorage, deletePacket, decryptPacket, exportEnvelope, importEnvelope, listEnvelopes, savePacket, type EncryptedEnvelope } from './storage';
import { buildAcknowledgementHtml, buildPacketHtml, downloadText, escapeHtml, filenameFor } from './exporter';

const app = document.querySelector<HTMLDivElement>('#app')!;
const steps = ['Engagement', 'Assets', 'Access tasks', 'Support', 'Acknowledgement', 'Export'];
const stageSlugs = ['engagement', 'assets', 'access-tasks', 'support', 'acknowledgement', 'export'];
const demoMode = location.pathname.replace(/\/$/, '') === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
const DEMO_PASSPHRASE = 'sample-packet-only-2026';
let envelopes: EncryptedEnvelope[] = [];
let unlockedPackets: Packet[] = [];
let packet: Packet | null = null;
let passphrase = '';
let step = 0;
let mode: 'loading' | 'welcome' | 'workspace' | 'notfound' = 'loading';
let notice = '';
let noticeKind: 'info' | 'success' | 'error' = 'info';
let saveState: 'saved' | 'saving' | 'error' = 'saved';
let saveTimer = 0;
let online = navigator.onLine;
let pendingFocus = false;

configureStorage(demoMode);

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
  document.querySelector('.toast')?.remove();
  const toast = document.createElement('div');
  toast.className = `toast ${kind}`;
  toast.setAttribute('role', kind === 'error' ? 'alert' : 'status');
  toast.textContent = message;
  document.querySelector('.topbar')?.after(toast);
  window.setTimeout(() => {
    if (notice === message) {
      notice = '';
      toast.remove();
    }
  }, 5000);
}

function shell(content: string): string {
  return `${demoMode ? `<aside class="demo-banner" aria-label="Sample mode"><strong>Demo — sample data, nothing is saved</strong><span>Changes stay separate from your packets.</span><button class="quiet compact" data-action="reset-demo">Reset demo</button><button class="quiet compact" data-action="start-real">Start for real</button></aside>` : ''}<header class="topbar">
    <a class="brand" href="/" aria-label="Closeout Kit home">${icon('signal')}<span><strong>Closeout Kit</strong><small>Client handoff packets</small></span></a>
    <nav class="main-nav" aria-label="Main"><a href="/">Home</a><a href="/demo">Demo</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav>
    <div class="top-actions">
      <span class="network ${online ? '' : 'offline'}"><span aria-hidden="true"></span>${online ? 'Packet data stays in this browser' : 'Offline · changes still save here'}</span>
      ${packet && !demoMode ? `<span class="save-state" aria-live="polite">${saveState === 'saving' ? 'Saving…' : saveState === 'error' ? 'Save failed' : 'Encrypted and saved'}</span>${envelopes.length > 1 ? `<button class="quiet compact" data-action="packets">Packets · ${envelopes.length}</button>` : ''}<button class="quiet compact" data-action="lock">${icon('lock')} Lock</button>` : ''}
    </div>
  </header>
  ${notice ? `<div class="toast ${noticeKind}" role="status">${value(notice)}</div>` : ''}
  <div id="route-announcer" class="sr-only" aria-live="polite"></div><main id="main">${content}</main>
  <footer><p><strong>Closeout Kit</strong> builds client handoff packets. Packet data is encrypted before this browser saves it.</p><nav aria-label="Footer"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="https://github.com/B-Divyesh/sf-client-offboarding-kit" rel="noreferrer">Source <span class="sr-only">(opens externally)</span></a></nav><p>Built by Param Factory · Build 1.1.0 · Generated artwork</p></footer>
  ${packetLibraryDialog()}`;
}

function loadingView(): string {
  return shell('<section class="loading-state" aria-live="polite"><span class="beacon"></span><h1>Open your client packet</h1><p>The browser is checking for encrypted packets.</p></section>');
}

function notFoundView(): string {
  return shell('<section class="not-found"><span class="eyebrow">404 · Page not found</span><h1 tabindex="-1">This page is not in the packet.</h1><p>Check the address, return home, or open the filled sample packet.</p><div class="inline-actions"><a class="primary button-link" href="/">Return home</a><a href="/demo">Try sample data</a></div></section>');
}

function welcomeView(): string {
  const hasPackets = envelopes.length > 0;
  return shell(`<section class="welcome">
    <picture class="harbor-scene">
      <source type="image/avif" srcset="/art/harbor-closeout-960.avif 960w, /art/harbor-closeout-1536.avif 1536w" sizes="100vw">
      <source type="image/webp" srcset="/art/harbor-closeout-960.webp 960w, /art/harbor-closeout-1536.webp 1536w" sizes="100vw">
      <img src="/art/harbor-closeout-1536.jpg" width="1536" height="1024" alt="A quiet harbor seen from a dark operations room, with a closed document case ready for handoff" fetchpriority="high" decoding="async">
    </picture>
    <div class="welcome-copy">
      <span class="eyebrow">Client handoff tool for freelancers and studios</span>
      <h1 tabindex="-1">Build a client closeout packet.</h1>
      <p>For freelance developers and web studios handing finished projects to clients.</p>
      <div class="demo-action"><a class="primary button-link" href="/demo">Try it with sample data ${icon('arrow')}</a><span>Opens a filled six-stage packet; your packets stay unchanged.</span></div>
      <form id="access-form" class="access-form">
        <label for="passphrase">${hasPackets ? 'Packet passphrase' : 'Create a packet passphrase'}</label>
        <input id="passphrase" name="passphrase" type="password" minlength="10" autocomplete="${hasPackets ? 'current-password' : 'new-password'}" required>
        ${hasPackets ? '' : '<label for="confirm-passphrase">Confirm passphrase</label><input id="confirm-passphrase" name="confirmPassphrase" type="password" minlength="10" autocomplete="new-password" required>'}
        <p class="field-help">Use at least 10 characters. Keep the passphrase because the app cannot recover it.</p>
        <button class="secondary" type="submit">${hasPackets ? 'Unlock your packet' : 'Create your packet'} ${icon('arrow')}</button>
      </form>
      <ul class="trust-row"><li>${icon('lock')} Encrypted before saving</li><li>No account needed</li><li>Works offline after the first visit</li></ul>
    </div>
  </section>
  <section class="preview-section" aria-labelledby="preview-heading"><div><span class="eyebrow">Filled packet preview</span><h2 id="preview-heading">See the handoff before you start.</h2><p>The sample shows assets, owners, access tasks, support dates, and acknowledgement in one packet.</p><a href="/demo">Open the sample packet</a></div><div class="preview-sheet"><span>Northstar Arts website</span><strong>3 assets</strong><strong>2 access tasks</strong><strong>Support through 27 September</strong><small>Sample data</small></div></section>
  <section class="welcome-lower" aria-labelledby="stages-heading"><div><span class="eyebrow">Six packet stages</span><h2 id="stages-heading">Complete the packet in six stages.</h2></div><ol>${steps.map((label, index) => `<li><b>${String(index + 1).padStart(2, '0')}</b>${label}</li>`).join('')}</ol></section>
  <section class="how-section" aria-labelledby="how-heading"><span class="eyebrow">How it works</span><h2 id="how-heading">Prepare, confirm, and hand over.</h2><ol><li><b>1. List the project.</b><span>Add asset links, owners, and support dates.</span></li><li><b>2. Confirm access tasks.</b><span>Check each change in the original service.</span></li><li><b>3. Send the packet.</b><span>Export the packet and import the client’s receipt.</span></li></ol></section>
  <section class="limits-section" aria-labelledby="limits-heading"><div><span class="eyebrow">Privacy and limits</span><h2 id="limits-heading">Keep credentials out of the packet.</h2></div><div><p>The app rejects common secret patterns. Share credentials through your password manager.</p><p>It does not move accounts, host files, migrate a CMS, or test client access.</p><p>Complete those actions in the original hosting, domain, CMS, or account service.</p></div></section>`);
}

function routeRail(): string {
  if (!packet) return '';
  const percent = completionPercent(packet);
  return `<aside class="route" aria-label="Packet stages"><div class="route-heading"><span class="eyebrow">Packet completion</span><strong>${percent}% ready</strong><div class="progress" role="progressbar" aria-label="Packet completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><span style="width:${percent}%"></span></div></div><ol>${steps.map((label, index) => `<li><button data-step="${index}" class="${step === index ? 'current' : ''}"${step === index ? ' aria-current="step"' : ''}><span>${index < step ? '✓' : String(index + 1).padStart(2, '0')}</span>${label}</button></li>`).join('')}</ol><div class="rail-note">${icon('lock')}<p><strong>Do not enter secrets.</strong> Add links to original services instead.</p></div></aside>`;
}

function workspaceView(): string {
  return shell(`<div class="workbench">${routeRail()}<section class="stage">${stageView()}</section></div>`);
}

function stageHeader(kicker: string, title: string, description: string): string {
  return `<header class="stage-header"><span class="eyebrow">${kicker}</span><h1 tabindex="-1">${title}</h1><p>${description}</p></header>`;
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
  return `${stageHeader('Stage 01 · Engagement', 'Describe the finished project.', 'Add the details your client will see at the top of the packet.')}
    <div class="form-grid">${inputField('Project name', 'projectName', p.projectName, { required: true, placeholder: 'Northwind website rebuild' })}${inputField('Client', 'clientName', p.clientName, { required: true, placeholder: 'Northwind Studio' })}${inputField('Prepared by', 'preparedBy', p.preparedBy, { required: true, placeholder: 'Your name or studio' })}${inputField('Closeout date', 'closeoutDate', p.closeoutDate, { type: 'date', required: true })}</div>
    ${textArea('Outcome summary', 'summary', p.summary, 'Describe what was delivered and the operator outcome. Do not include secrets.')}${stepActions(false)}`;
}

function assetsStage(p: Packet): string {
  return `${stageHeader('Stage 02 · Assets', 'List assets and owners.', 'Add what exists, where it lives, and who should own it. Links must use HTTPS.')}
  <div class="security-callout">${icon('lock')}<div><strong>Do not enter credentials.</strong><p>Use a password-manager sharing link. The app rejects common secret patterns.</p></div></div>
  <form id="asset-form" class="entry-form"><div class="form-grid"><label class="field"><span>Asset or system *</span><input name="name" required placeholder="Production repository"></label><label class="field"><span>Type *</span><select name="kind" required><option>Source code</option><option>Hosting</option><option>Domain & DNS</option><option>CMS</option><option>Analytics</option><option>Design files</option><option>Documentation</option><option>Other</option></select></label><label class="field wide"><span>Original service link</span><input name="url" type="url" inputmode="url" placeholder="https://…"><small>Use a complete HTTPS address.</small></label><label class="field"><span>Current owner *</span><input name="currentOwner" required></label><label class="field"><span>Destination owner *</span><input name="destinationOwner" required></label><label class="field wide"><span>Non-secret note</span><textarea name="note" rows="2" placeholder="Repository includes deployment guide in /docs"></textarea></label></div><button class="secondary" type="submit">${icon('plus')} Add asset</button></form>
  <div class="records"><div class="records-title"><h2>Recorded assets</h2><span>${p.assets.length}</span></div>${p.assets.length ? `<ul>${p.assets.map((a) => `<li><div class="record-main"><span class="record-type">${value(a.kind)}</span><strong>${value(a.name)}</strong><p>${value(a.currentOwner)} <span aria-hidden="true">→</span> ${value(a.destinationOwner)}</p>${a.url ? `<a href="${value(a.url)}" target="_blank" rel="noreferrer">Open original service <span class="sr-only">(opens externally)</span><span aria-hidden="true">↗</span></a>` : ''}</div><button class="icon-button danger" data-delete-asset="${a.id}" aria-label="Remove ${value(a.name)}">Remove</button></li>`).join('')}</ul>` : '<div class="empty"><span>No assets yet</span><p>Start with the production repository, hosting, and domain.</p></div>'}</div>${stepActions()}`;
}

function actionsStage(p: Packet): string {
  return `${stageHeader('Stage 03 · Access tasks', 'Confirm account changes.', 'Record each transfer or removal task. Confirm it only after checking the original service.')}
  <form id="action-form" class="entry-form"><div class="form-grid"><label class="field wide"><span>Access task *</span><input name="action" required placeholder="Transfer organisation ownership to client admin"></label><label class="field"><span>Original service *</span><input name="system" required placeholder="Code host"></label><label class="field"><span>Responsible person *</span><input name="responsible" required></label><label class="field"><span>Due date *</span><input name="due" type="date" required></label></div><button class="secondary" type="submit">${icon('plus')} Add access task</button></form>
  <div class="records"><div class="records-title"><h2>Access task list</h2><span>${p.actions.filter((a) => a.status === 'complete').length}/${p.actions.length} confirmed</span></div>${p.actions.length ? `<ul class="action-list">${p.actions.map((a) => `<li class="${a.status === 'complete' ? 'done' : ''}"><div class="record-main"><span class="record-type">${value(a.system)} · due ${value(a.due)}</span><strong>${value(a.action)}</strong><p>Responsible: ${value(a.responsible)}</p><label class="confirm-line"><input type="checkbox" data-confirm-action="${a.id}"${checked(a.confirmedExternal)}> I verified this task in ${value(a.system)}</label></div><div class="record-actions"><button class="small ${a.status === 'complete' ? 'quiet' : 'secondary'}" data-toggle-action="${a.id}">${a.status === 'complete' ? 'Reopen task' : 'Mark task complete'}</button><button class="icon-button danger" data-delete-action="${a.id}" aria-label="Remove ${value(a.action)}">Remove</button></div></li>`).join('')}</ul>` : '<div class="empty"><span>No access tasks yet</span><p>Add account invitations, ownership transfers, and former-contributor removals.</p></div>'}</div>${stepActions()}`;
}

function supportStage(p: Packet): string {
  return `${stageHeader('Stage 04 · Support', 'Set the support period.', 'Add support dates, a contact, and the work included during this period.')}
  <div class="form-grid">${inputField('Support starts', 'support.starts', p.support.starts, { type: 'date', required: true })}${inputField('Support ends', 'support.ends', p.support.ends, { type: 'date', required: true })}${inputField('Support contact', 'support.contact', p.support.contact, { required: true, placeholder: 'support@example.com' })}<label class="field"><span>Primary channel</span><select data-field="support.channel"><option${p.support.channel === 'Email' ? ' selected' : ''}>Email</option><option${p.support.channel === 'Client portal' ? ' selected' : ''}>Client portal</option><option${p.support.channel === 'Shared chat' ? ' selected' : ''}>Shared chat</option><option${p.support.channel === 'Phone' ? ' selected' : ''}>Phone</option></select></label></div>
  ${textArea('Included during the window', 'support.included', p.support.included, 'Example: production defects in delivered work, access clarification, one operator walkthrough.')}${textArea('Outside the window / new work', 'support.excluded', p.support.excluded, 'Example: feature requests, vendor outages, content changes, and third-party subscription costs.')}${stepActions()}`;
}

function acknowledgementStage(p: Packet): string {
  const blockers = [p.assets.length ? '' : 'Add at least one asset.', p.actions.length ? '' : 'Add at least one access task.', p.actions.every((a) => a.status === 'complete' && a.confirmedExternal) ? '' : 'Confirm every access task in its original service.', p.support.ends ? '' : 'Set the support end date.'].filter(Boolean);
  return `${stageHeader('Stage 05 · Acknowledgement', 'Collect the client’s receipt.', 'Send the acknowledgement form to your client, then import the receipt they return.')}
  ${blockers.length ? `<div class="readiness"><strong>Before acknowledgement</strong><ul>${blockers.map((item) => `<li>${item}</li>`).join('')}</ul></div>` : '<div class="readiness ready">✓ Ownership and support records are ready for client review.</div>'}
  <div class="receipt-flow"><button class="secondary" data-action="export-acknowledgement">${icon('download')} Download client acknowledgement form</button><label class="secondary file-button">${icon('plus')} Import client receipt<input id="receipt-file" type="file" accept="application/json,.json"></label><p>The receipt contains acknowledgement details, not asset links or credentials.</p></div>
  <details class="manual-ack"><summary>Record acknowledgement together</summary><div class="ack-box"><p>Use this only when the client is reviewing the packet with you.</p><label><input type="checkbox" data-field="acknowledgement.received"${checked(p.acknowledgement.received)}> I received the listed assets and links.</label><label><input type="checkbox" data-field="acknowledgement.ownership"${checked(p.acknowledgement.ownership)}> I understand the documented ownership state.</label><label><input type="checkbox" data-field="acknowledgement.noSecrets"${checked(p.acknowledgement.noSecrets)}> I understand credentials are shared separately.</label><div class="form-grid">${inputField('Client representative', 'acknowledgement.signer', p.acknowledgement.signer, { required: true })}${inputField('Role', 'acknowledgement.role', p.acknowledgement.role)}${inputField('Acknowledgement date', 'acknowledgement.signedAt', p.acknowledgement.signedAt, { type: 'date', required: true })}</div><button class="primary" data-action="acknowledge">${acknowledgementComplete(p) ? 'Update acknowledgement' : 'Record acknowledgement'}</button></div></details>
  <details class="history"><summary>Packet history (${p.history.length})</summary><ol>${p.history.map((event) => `<li><time datetime="${event.at}">${new Date(event.at).toLocaleString()}</time>${value(event.label)}</li>`).join('')}</ol></details>${stepActions(true, 'Review exports')}`;
}

function exportStage(p: Packet): string {
  const complete = acknowledgementComplete(p);
  return `${stageHeader('Stage 06 · Export', complete ? 'Download the completed packet.' : 'Download a marked draft.', 'Download a browser-ready client packet, print it to PDF, or keep an encrypted backup.')}
  <div class="departure ${complete ? 'complete' : ''}"><span class="departure-mark">${complete ? '✓' : '!'}</span><div><span class="eyebrow">${complete ? 'Acknowledgement received' : 'Acknowledgement pending'}</span><h2>${value(p.projectName || 'Untitled project')}</h2><p>${p.assets.length} assets · ${p.actions.filter((a) => a.status === 'complete').length}/${p.actions.length} access tasks confirmed · Support through ${value(p.support.ends || 'not set')}</p></div></div>
  <div class="export-grid"><button class="export-card" data-action="export-html">${icon('download')}<span><strong>Download client packet</strong><small>Standalone HTML · opens anywhere</small></span></button><button class="export-card" data-action="print">${icon('download')}<span><strong>Print or save PDF</strong><small>Uses your browser’s print dialog</small></span></button><button class="export-card" data-action="export-backup">${icon('lock')}<span><strong>Download encrypted backup</strong><small>JSON · requires your passphrase</small></span></button><label class="export-card file-card">${icon('plus')}<span><strong>Import encrypted backup</strong><small>Restores a JSON packet</small></span><input id="import-file" type="file" accept="application/json,.json"></label></div>
  ${demoMode ? '' : '<div class="danger-zone"><div><strong>Delete this packet</strong><p>Download a backup first. Deletion cannot be undone.</p></div><button class="danger-button" data-action="delete-packet">Delete packet</button></div>'}${stepActions(true, 'Return to engagement')}`;
}

function stageView(): string {
  if (!packet) return '';
  return [engagementStage, assetsStage, actionsStage, supportStage, acknowledgementStage, exportStage][step](packet);
}

function packetLibraryDialog(): string {
  if (!packet) return '';
  return `<dialog id="packet-dialog"><button class="dialog-close" data-action="close-packets" aria-label="Close packet list">×</button><span class="eyebrow">Encrypted in this browser</span><h2>Your packets</h2><p>Packets are decrypted only for this unlocked session.</p><ul class="packet-list">${unlockedPackets.map((item) => `<li class="${item.id === packet?.id ? 'active' : ''}"><button data-open-packet="${item.id}"><strong>${value(item.projectName || 'Untitled packet')}</strong><small>${value(item.clientName || 'No client yet')} · updated ${new Date(item.updatedAt).toLocaleDateString()}</small></button></li>`).join('')}</ul></dialog>`;
}

const stageTitles = [
  'Engagement — Closeout Kit',
  'Assets — Closeout Kit',
  'Access tasks — Closeout Kit',
  'Support — Closeout Kit',
  'Acknowledgement — Closeout Kit',
  'Export — Closeout Kit'
];

function routeForStage(index: number): string {
  return demoMode ? `/demo?stage=${stageSlugs[index]}` : `/packet/${stageSlugs[index]}`;
}

function routeStep(): number {
  if (demoMode) {
    const queryStep = new URLSearchParams(location.search).get('stage');
    return Math.max(0, stageSlugs.indexOf(queryStep ?? 'engagement'));
  }
  const match = location.pathname.match(/^\/packet\/([^/]+)\/?$/);
  return match ? Math.max(0, stageSlugs.indexOf(match[1])) : 0;
}

function updateMetadata(): void {
  const title = mode === 'notfound' ? 'Page not found — Closeout Kit' : mode === 'workspace' ? (demoMode ? `Demo · ${stageTitles[step]}` : stageTitles[step]) : 'Closeout Kit — build client handoff packets';
  const description = demoMode ? 'Try a filled client handoff packet with isolated sample data.' : 'Build a client packet with asset links, owners, access tasks, support dates, and acknowledgement.';
  document.title = title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', title);
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', description);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute('content', title);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')?.setAttribute('content', description);
  const canonical = `https://client-offboarding-kit.sociobot.in${demoMode ? '/demo' : mode === 'workspace' ? `/packet/${stageSlugs[step]}` : '/'}`;
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', canonical);
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', canonical);
}

function goToStage(index: number, push = true): void {
  step = Math.max(0, Math.min(5, index));
  if (push) history.pushState({ step }, '', routeForStage(step));
  pendingFocus = true;
  render();
  window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

function render(): void {
  const focused = document.activeElement instanceof HTMLElement ? document.activeElement.id : '';
  app.innerHTML = mode === 'loading' ? loadingView() : mode === 'welcome' ? welcomeView() : mode === 'notfound' ? notFoundView() : workspaceView();
  updateMetadata();
  if (pendingFocus) {
    const heading = document.querySelector<HTMLElement>('main h1');
    heading?.focus({ preventScroll: true });
    const announcer = document.querySelector('#route-announcer');
    if (announcer) announcer.textContent = heading?.textContent ?? document.title;
    pendingFocus = false;
  } else if (focused) document.getElementById(focused)?.focus({ preventScroll: true });
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
      if (savedStatus) savedStatus.textContent = 'Encrypted and saved';
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
    envelopes = await listEnvelopes();
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
  step = location.pathname.startsWith('/packet/') ? routeStep() : 0;
  goToStage(step, !location.pathname.startsWith('/packet/'));
}

function showFormError(form: HTMLFormElement, field: HTMLInputElement | HTMLTextAreaElement, message: string): void {
  form.querySelector('.form-error')?.remove();
  const error = document.createElement('p');
  error.id = 'asset-form-error';
  error.className = 'form-error';
  error.setAttribute('role', 'alert');
  error.textContent = message;
  field.setAttribute('aria-invalid', 'true');
  field.setAttribute('aria-describedby', error.id);
  field.closest('.field')?.append(error);
  field.focus();
}

app.addEventListener('submit', async (event) => {
  const form = event.target as HTMLFormElement;
  event.preventDefault();
  if (form.id === 'access-form') return startOrUnlock(form);
  if (form.id === 'asset-form' && packet) {
    const data = Object.fromEntries(new FormData(form));
    const controls = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')];
    const secretField = controls.find((control) => containsSecretLike(control.value));
    if (secretField) return showFormError(form, secretField, 'This looks like a credential or private key. Add a password-manager link instead.');
    if (!safeExternalUrl(String(data.url))) return showFormError(form, form.elements.namedItem('url') as HTMLInputElement, 'Enter a complete HTTPS address.');
    packet.assets.push({ id: crypto.randomUUID(), name: String(data.name), kind: String(data.kind), url: String(data.url), currentOwner: String(data.currentOwner), destinationOwner: String(data.destinationOwner), note: String(data.note) });
    addHistory(packet, `Asset added: ${String(data.name)}`);
    packet.updatedAt = new Date().toISOString(); queueSave(); render(); return;
  }
  if (form.id === 'action-form' && packet) {
    const data = Object.fromEntries(new FormData(form));
    if (Object.values(data).map(String).some(containsSecretLike)) return showNotice('That entry looks like a secret. Describe the action without credentials.', 'error');
    packet.actions.push({ id: crypto.randomUUID(), action: String(data.action), system: String(data.system), responsible: String(data.responsible), due: String(data.due), status: 'pending', confirmedExternal: false });
    addHistory(packet, `Access task added: ${String(data.action)}`);
    packet.updatedAt = new Date().toISOString(); queueSave(); render(); return;
  }
});

app.addEventListener('input', (event) => {
  const input = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  if (input.getAttribute('aria-invalid') === 'true') {
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    input.closest('.field')?.querySelector('.form-error')?.remove();
  }
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
      goToStage(0);
      showNotice('Encrypted packet imported and opened.', 'success');
    } catch (error) {
      showNotice(error instanceof Error ? error.message : 'The backup could not be imported.', 'error');
    }
  }
  if (input.id === 'receipt-file' && input.files?.[0] && packet) {
    try {
      const parsed: unknown = JSON.parse(await input.files[0].text());
      if (!validateAcknowledgementReceipt(parsed, packet)) throw new Error('Choose the acknowledgement receipt created for this packet.');
      const receipt = parsed as { signer: string; role: string; signedAt: string };
      packet.acknowledgement = { received: true, ownership: true, noSecrets: true, signer: receipt.signer, role: receipt.role, signedAt: receipt.signedAt };
      addHistory(packet, `Client receipt imported: ${receipt.signer}`);
      queueSave();
      render();
      showNotice('Client acknowledgement receipt imported.', 'success');
    } catch (error) {
      showNotice(error instanceof Error ? error.message : 'The receipt could not be imported.', 'error');
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
  if (target.dataset.step) { goToStage(Number(target.dataset.step)); return; }
  const action = target.dataset.action;
  if (action === 'reset-demo') { await clearDemoStorage(); location.assign('/demo'); return; }
  if (action === 'start-real') { await clearDemoStorage(); location.assign('/'); return; }
  if (!packet) return;
  if (target.dataset.openPacket) { const selected = unlockedPackets.find((item) => item.id === target.dataset.openPacket); if (selected) { packet = selected; (document.querySelector('#packet-dialog') as HTMLDialogElement)?.close(); goToStage(0); } }
  if (action === 'next') { if (!validEngagement()) return; goToStage(step === 5 ? 0 : step + 1); }
  if (action === 'back') { goToStage(step - 1); }
  if (action === 'lock') { clearTimeout(saveTimer); if (packet && passphrase) await savePacket(packet, passphrase); packet = null; passphrase = ''; mode = 'welcome'; history.pushState({}, '', '/'); pendingFocus = true; render(); }
  if (action === 'packets') (document.querySelector('#packet-dialog') as HTMLDialogElement)?.showModal();
  if (action === 'close-packets') (document.querySelector('#packet-dialog') as HTMLDialogElement)?.close();
  if (target.dataset.deleteAsset && packet) {
    const asset = packet.assets.find((item) => item.id === target.dataset.deleteAsset);
    if (asset && confirm(`Remove “${asset.name}” from this packet?`)) { packet.assets = packet.assets.filter((item) => item.id !== asset.id); addHistory(packet, `Asset removed: ${asset.name}`); queueSave(); render(); }
  }
  if (target.dataset.deleteAction && packet) {
    const item = packet.actions.find((entry) => entry.id === target.dataset.deleteAction);
    if (item && confirm(`Remove “${item.action}” from the access task list?`)) { packet.actions = packet.actions.filter((entry) => entry.id !== item.id); addHistory(packet, `Access task removed: ${item.action}`); queueSave(); render(); }
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
  if (action === 'export-acknowledgement' && packet) { downloadText(filenameFor(packet, 'acknowledgement.html'), buildAcknowledgementHtml(packet), 'text/html'); addHistory(packet, 'Client acknowledgement form exported'); queueSave(); }
  if (action === 'print' && packet) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return showNotice('Allow pop-ups to open the print-ready packet.', 'error');
    printWindow.document.write(buildPacketHtml(packet)); printWindow.document.close(); printWindow.addEventListener('load', () => printWindow.print());
  }
  if (action === 'export-backup' && packet) {
    const envelope = await exportEnvelope(packet.id);
    if (envelope) downloadText(filenameFor(packet, 'closeout.json'), JSON.stringify(envelope, null, 2), 'application/json');
  }
  if (action === 'delete-packet' && packet) {
    const name = packet.projectName || 'Untitled packet';
    if (confirm(`Permanently delete “${name}” from this browser? Download a backup first if you may need it.`)) { await deletePacket(packet.id); envelopes = await listEnvelopes(); unlockedPackets = unlockedPackets.filter((item) => item.id !== packet?.id); packet = null; passphrase = ''; mode = 'welcome'; history.pushState({}, '', '/'); pendingFocus = true; render(); }
  }
});

window.addEventListener('online', () => { online = true; render(); });
window.addEventListener('offline', () => { online = false; render(); });
window.addEventListener('popstate', () => {
  if (mode === 'workspace') {
    const nextStep = routeStep();
    step = nextStep;
    pendingFocus = true;
    render();
  }
});

async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    let applyUpdate = false;
    const offerUpdate = () => {
      document.querySelector('.update-toast')?.remove();
      const toast = document.createElement('div');
      toast.className = 'toast update-toast';
      toast.setAttribute('role', 'status');
      toast.innerHTML = '<span>A new version is ready.</span><button type="button">Reload and update</button>';
      toast.querySelector('button')?.addEventListener('click', () => { applyUpdate = true; registration.waiting?.postMessage({ type: 'SKIP_WAITING' }); });
      document.querySelector('.topbar')?.after(toast);
    };
    if (registration.waiting) offerUpdate();
    registration.addEventListener('updatefound', () => registration.installing?.addEventListener('statechange', () => {
      if (registration.waiting && navigator.serviceWorker.controller) offerUpdate();
    }));
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (applyUpdate) location.reload(); });
  } catch { /* The app remains fully usable without install support. */ }
}

async function init(): Promise<void> {
  render();
  const knownPath = location.pathname === '/' || location.pathname === '/index.html' || demoMode || /^\/packet\/(engagement|assets|access-tasks|support|acknowledgement|export)\/?$/.test(location.pathname);
  if (!knownPath) {
    mode = 'notfound';
    render();
    registerServiceWorker();
    return;
  }
  try { envelopes = await listEnvelopes(); } catch (error) { showNotice(error instanceof Error ? error.message : 'Local storage is unavailable.', 'error'); }
  if (demoMode) {
    await clearDemoStorage();
    packet = createDemoPacket();
    passphrase = DEMO_PASSPHRASE;
    await savePacket(packet, passphrase);
    envelopes = await listEnvelopes();
    unlockedPackets = [packet];
    mode = 'workspace';
    step = routeStep();
    if (location.pathname !== '/demo' || new URLSearchParams(location.search).has('demo')) history.replaceState({ step }, '', routeForStage(step));
    render();
  } else {
    mode = 'welcome';
    render();
  }
  registerServiceWorker();
}

init();
