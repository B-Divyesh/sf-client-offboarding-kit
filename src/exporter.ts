import type { Packet } from './model';
import { acknowledgementComplete } from './model';

export const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char] ?? char);

const niceDate = (value: string) => {
  if (!value) return 'Not set';
  return new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
};

const multiline = (value: string) => escapeHtml(value).replace(/\n/g, '<br>');

export function buildPacketHtml(packet: Packet): string {
  const color = /^#[0-9a-f]{6}$/i.test(packet.brand.color) ? packet.brand.color : '#D9784A';
  const assets = packet.assets.length
    ? packet.assets.map((asset) => `<tr><td><strong>${escapeHtml(asset.name)}</strong><small>${escapeHtml(asset.kind)}</small></td><td>${asset.url ? `<a href="${escapeHtml(asset.url)}">Open system of record</a>` : '—'}</td><td>${escapeHtml(asset.currentOwner)} → ${escapeHtml(asset.destinationOwner)}</td><td>${multiline(asset.note) || '—'}</td></tr>`).join('')
    : '<tr><td colspan="4">No assets were listed.</td></tr>';
  const actions = packet.actions.length
    ? packet.actions.map((action) => `<li><span class="check">${action.status === 'complete' && action.confirmedExternal ? '✓' : '○'}</span><div><strong>${escapeHtml(action.action)}</strong> · ${escapeHtml(action.system)}<small>Responsible: ${escapeHtml(action.responsible)} · Due ${niceDate(action.due)} · ${action.confirmedExternal ? 'Confirmed in the external system' : 'External confirmation outstanding'}</small></div></li>`).join('')
    : '<li>No transfer or revoke actions were listed.</li>';
  const acknowledgement = acknowledgementComplete(packet)
    ? `<p class="signature">Acknowledged by <strong>${escapeHtml(packet.acknowledgement.signer)}</strong>${packet.acknowledgement.role ? `, ${escapeHtml(packet.acknowledgement.role)}` : ''} on ${niceDate(packet.acknowledgement.signedAt)}.</p>`
    : '<p class="pending">Acknowledgement is still pending.</p>';

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(packet.projectName || 'Client')} closeout packet</title>
<style>:root{--ink:#142023;--muted:#526365;--paper:#f7f4eb;--accent:${color}}*{box-sizing:border-box}body{margin:0;background:#e9e5da;color:var(--ink);font:16px/1.55 system-ui,sans-serif}main{max-width:940px;margin:0 auto;background:var(--paper);min-height:100vh;padding:64px}header{border-top:10px solid var(--accent);padding-top:36px}h1,h2{font-family:Georgia,serif}h1{font-size:46px;line-height:1.05;margin:.2em 0}h2{font-size:25px;margin:48px 0 16px}.eyebrow,small{display:block;color:var(--muted);font-size:13px;letter-spacing:.08em;text-transform:uppercase}.summary{font-size:20px;max-width:65ch}.facts{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin:32px 0}.facts div{border-top:1px solid #b9c2be;padding-top:10px}.facts b{display:block}table{width:100%;border-collapse:collapse;font-size:14px}th{text-align:left;color:var(--muted);border-bottom:2px solid var(--ink)}td,th{padding:12px 8px;vertical-align:top}td{border-bottom:1px solid #d2d7d2}a{color:#1c6264}ul{list-style:none;padding:0}li{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid #d2d7d2}.check{font-size:22px;color:#386d55}.support{padding:24px;border-left:5px solid var(--accent);background:#eeeae0}.signature{border-bottom:1px solid var(--ink);padding:32px 0 12px}.pending{color:#8b3f2d;font-weight:700}.notice{margin-top:44px;font-size:13px;color:var(--muted)}@media(max-width:650px){main{padding:32px 20px}.facts{grid-template-columns:1fr}h1{font-size:34px}table,tbody,tr,td{display:block}thead{display:none}td{border:0;padding:4px 0}tr{display:block;border-bottom:1px solid #bbb;padding:12px 0}}@media print{body{background:white}main{padding:0;max-width:none}.no-print{display:none}@page{margin:16mm}}</style></head>
<body><main><header><span class="eyebrow">${escapeHtml(packet.brand.name || packet.preparedBy)} · Client closeout</span><h1>${escapeHtml(packet.projectName || 'Project closeout')}</h1><p class="summary">${multiline(packet.summary) || 'A portable record of the assets, owners, remaining actions, and support boundary for this engagement.'}</p><div class="facts"><div><span class="eyebrow">Client</span><b>${escapeHtml(packet.clientName)}</b></div><div><span class="eyebrow">Prepared by</span><b>${escapeHtml(packet.preparedBy)}</b></div><div><span class="eyebrow">Closeout date</span><b>${niceDate(packet.closeoutDate)}</b></div></div></header>
<section><h2>Assets and ownership</h2><table><thead><tr><th>Asset</th><th>Record</th><th>Ownership</th><th>Notes</th></tr></thead><tbody>${assets}</tbody></table></section>
<section><h2>Transfer and revoke actions</h2><ul>${actions}</ul></section>
<section><h2>Support window</h2><div class="support"><strong>${niceDate(packet.support.starts)} — ${niceDate(packet.support.ends)}</strong><p>${escapeHtml(packet.support.contact)} · ${escapeHtml(packet.support.channel)}</p><p><b>Included:</b> ${multiline(packet.support.included) || 'Not specified'}</p><p><b>Outside this window:</b> ${multiline(packet.support.excluded) || 'Not specified'}</p></div></section>
<section><h2>Client acknowledgement</h2><p>The client confirms receipt of the listed assets, accepts the documented ownership state, and understands that credentials and secrets are exchanged separately through the relevant secure systems.</p>${acknowledgement}</section>
<p class="notice">Generated locally with Closeout Kit. This packet contains links and ownership records, not passwords, API keys, or private keys. Verify live access in each system of record.</p></main></body></html>`;
}

export function downloadText(filename: string, contents: string, type: string): void {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function filenameFor(packet: Packet, extension: string): string {
  const base = (packet.projectName || 'client-closeout').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${base || 'client-closeout'}.${extension}`;
}
