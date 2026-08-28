export type Asset = {
  id: string;
  name: string;
  kind: string;
  url: string;
  currentOwner: string;
  destinationOwner: string;
  note: string;
};

export type TransferAction = {
  id: string;
  action: string;
  system: string;
  responsible: string;
  due: string;
  status: 'pending' | 'complete';
  confirmedExternal: boolean;
};

export type PacketHistory = { at: string; label: string };

export type Packet = {
  id: string;
  version: 1;
  projectName: string;
  clientName: string;
  preparedBy: string;
  closeoutDate: string;
  summary: string;
  assets: Asset[];
  actions: TransferAction[];
  support: {
    starts: string;
    ends: string;
    contact: string;
    channel: string;
    included: string;
    excluded: string;
  };
  acknowledgement: {
    received: boolean;
    ownership: boolean;
    noSecrets: boolean;
    signer: string;
    role: string;
    signedAt: string;
  };
  brand: { name: string; color: string };
  history: PacketHistory[];
  createdAt: string;
  updatedAt: string;
};

export type AcknowledgementReceipt = {
  format: 'closeout-kit-acknowledgement';
  version: 1;
  packetId: string;
  projectName: string;
  received: true;
  ownership: true;
  noSecrets: true;
  signer: string;
  role: string;
  signedAt: string;
};

export const today = () => new Date().toISOString().slice(0, 10);

export function createPacket(): Packet {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    version: 1,
    projectName: '',
    clientName: '',
    preparedBy: '',
    closeoutDate: today(),
    summary: '',
    assets: [],
    actions: [],
    support: { starts: today(), ends: '', contact: '', channel: 'Email', included: '', excluded: '' },
    acknowledgement: { received: false, ownership: false, noSecrets: false, signer: '', role: '', signedAt: '' },
    brand: { name: '', color: '#D9784A' },
    history: [{ at: now, label: 'Packet created' }],
    createdAt: now,
    updatedAt: now
  };
}

export function createDemoPacket(): Packet {
  const packet = createPacket();
  packet.id = 'demo-northstar-site';
  packet.projectName = 'Northstar Arts website';
  packet.clientName = 'Northstar Arts Council';
  packet.preparedBy = 'Tideway Web Studio';
  packet.closeoutDate = '2026-08-28';
  packet.summary = 'New public website, event archive, and editor guide delivered for the autumn programme.';
  packet.assets = [
    { id: 'demo-repo', name: 'Production repository', kind: 'Source code', url: 'https://github.com/example/northstar-site', currentOwner: 'Tideway Web Studio', destinationOwner: 'Northstar Arts Council', note: 'Deployment guide is in /docs/operations.md.' },
    { id: 'demo-host', name: 'Production hosting', kind: 'Hosting', url: 'https://example.com/northstar-hosting', currentOwner: 'Tideway Web Studio', destinationOwner: 'Northstar Arts Council', note: 'Billing owner changes after the client accepts the invitation.' },
    { id: 'demo-domain', name: 'northstar-arts.example', kind: 'Domain & DNS', url: 'https://example.com/northstar-domain', currentOwner: 'Northstar Arts Council', destinationOwner: 'Northstar Arts Council', note: 'Registrar remains with the client.' }
  ];
  packet.actions = [
    { id: 'demo-transfer', action: 'Transfer repository ownership', system: 'Code host', responsible: 'Maya Chen', due: '2026-08-29', status: 'complete', confirmedExternal: true },
    { id: 'demo-remove', action: 'Remove studio deployment access', system: 'Hosting service', responsible: 'Jon Bell', due: '2026-09-05', status: 'pending', confirmedExternal: false }
  ];
  packet.support = { starts: '2026-08-28', ends: '2026-09-27', contact: 'support@tideway.example', channel: 'Email', included: 'Delivered-work defects, access questions, and one editor walkthrough.', excluded: 'New features, content entry, vendor outages, and subscription costs.' };
  packet.history = [{ at: packet.createdAt, label: 'Sample packet created' }];
  return packet;
}

export function addHistory(packet: Packet, label: string): void {
  packet.history = [{ at: new Date().toISOString(), label }, ...packet.history].slice(0, 20);
}

export function containsSecretLike(value: string): boolean {
  return /(-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----|(?:api[_-]?key|secret|password|passwd|access[_-]?token)\s*[:=]|\bsk-[A-Za-z0-9_-]{16,}|\bgh[opusr]_[A-Za-z0-9]{20,}|\bxox[baprs]-)/i.test(value);
}

export function safeExternalUrl(value: string): boolean {
  if (!value) return true;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

export function acknowledgementComplete(packet: Packet): boolean {
  const a = packet.acknowledgement;
  return a.received && a.ownership && a.noSecrets && Boolean(a.signer.trim() && a.signedAt);
}

export function completionPercent(packet: Packet): number {
  const checks = [
    Boolean(packet.projectName && packet.clientName && packet.preparedBy),
    packet.assets.length > 0,
    packet.actions.length > 0 && packet.actions.every((a) => a.status === 'complete' && a.confirmedExternal),
    Boolean(packet.support.ends && packet.support.contact && packet.support.included),
    acknowledgementComplete(packet)
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function validatePacketShape(value: unknown): value is Packet {
  if (!value || typeof value !== 'object') return false;
  const packet = value as Partial<Packet>;
  return packet.version === 1 && typeof packet.id === 'string' && Array.isArray(packet.assets) && Array.isArray(packet.actions) && Boolean(packet.support && packet.acknowledgement);
}

export function validateAcknowledgementReceipt(value: unknown, packet: Packet): value is AcknowledgementReceipt {
  if (!value || typeof value !== 'object') return false;
  const receipt = value as Partial<AcknowledgementReceipt>;
  return receipt.format === 'closeout-kit-acknowledgement'
    && receipt.version === 1
    && receipt.packetId === packet.id
    && receipt.projectName === packet.projectName
    && receipt.received === true
    && receipt.ownership === true
    && receipt.noSecrets === true
    && typeof receipt.signer === 'string'
    && Boolean(receipt.signer.trim())
    && typeof receipt.role === 'string'
    && typeof receipt.signedAt === 'string'
    && /^\d{4}-\d{2}-\d{2}$/.test(receipt.signedAt)
    && !containsSecretLike(`${receipt.signer} ${receipt.role}`);
}
