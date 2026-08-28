import { describe, expect, it } from 'vitest';
import { acknowledgementComplete, completionPercent, containsSecretLike, createPacket, safeExternalUrl } from '../src/model';
import { buildPacketHtml, escapeHtml } from '../src/exporter';

describe('security boundaries', () => {
  it('rejects common secret material while allowing ordinary handoff notes', () => {
    expect(containsSecretLike('password=hunter2')).toBe(true);
    expect(containsSecretLike('-----BEGIN PRIVATE KEY-----')).toBe(true);
    expect(containsSecretLike('ghp_123456789012345678901234')).toBe(true);
    expect(containsSecretLike('Credentials shared separately in 1Password')).toBe(false);
  });

  it('only accepts HTTPS system-of-record links', () => {
    expect(safeExternalUrl('https://example.com/project')).toBe(true);
    expect(safeExternalUrl('')).toBe(true);
    expect(safeExternalUrl('http://example.com')).toBe(false);
    expect(safeExternalUrl('javascript:alert(1)')).toBe(false);
  });
});

describe('packet readiness and export', () => {
  it('requires explicit acknowledgement', () => {
    const packet = createPacket();
    expect(acknowledgementComplete(packet)).toBe(false);
    packet.acknowledgement = { received: true, ownership: true, noSecrets: true, signer: 'Ari Client', role: 'Owner', signedAt: '2026-08-28' };
    expect(acknowledgementComplete(packet)).toBe(true);
    expect(completionPercent(packet)).toBe(20);
  });

  it('builds a portable escaped HTML packet', () => {
    const packet = createPacket();
    packet.projectName = '<script>alert(1)</script>';
    packet.clientName = 'Northwind & Co';
    packet.preparedBy = 'Studio';
    const html = buildPacketHtml(packet);
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('Northwind &amp; Co');
    expect(html).toContain('<!doctype html>');
  });

  it('escapes all markup-sensitive characters', () => {
    expect(escapeHtml(`<>&'"`)).toBe('&lt;&gt;&amp;&#39;&quot;');
  });
});
