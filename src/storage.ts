import type { Packet } from './model';
import { validatePacketShape } from './model';

export type EncryptedEnvelope = {
  format: 'closeout-kit-encrypted';
  version: 1;
  id: string;
  salt: string;
  iv: string;
  ciphertext: string;
  updatedAt: string;
};

const DB_NAME = 'closeout-kit-v1';
const STORE = 'encrypted-packets';
const ITERATIONS = 160_000;

const toBase64 = (bytes: Uint8Array) => {
  let binary = '';
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary);
};

const fromBase64 = (value: string) => {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptPacket(packet: Packet, passphrase: string): Promise<EncryptedEnvelope> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const plaintext = new TextEncoder().encode(JSON.stringify(packet));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);
  return {
    format: 'closeout-kit-encrypted',
    version: 1,
    id: packet.id,
    salt: toBase64(salt),
    iv: toBase64(iv),
    ciphertext: toBase64(new Uint8Array(ciphertext)),
    updatedAt: packet.updatedAt
  };
}

export async function decryptPacket(envelope: EncryptedEnvelope, passphrase: string): Promise<Packet> {
  const key = await deriveKey(passphrase, fromBase64(envelope.salt));
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromBase64(envelope.iv) }, key, fromBase64(envelope.ciphertext));
  const packet: unknown = JSON.parse(new TextDecoder().decode(decrypted));
  if (!validatePacketShape(packet)) throw new Error('This backup is not a supported Closeout Kit packet.');
  return packet;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Private local storage could not be opened. Check browser storage permissions.'));
  });
}

export async function listEnvelopes(): Promise<EncryptedEnvelope[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const request = tx.objectStore(STORE).getAll();
    request.onsuccess = () => resolve((request.result as EncryptedEnvelope[]).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
    request.onerror = () => reject(new Error('Saved packets could not be read.'));
    tx.oncomplete = () => db.close();
  });
}

export async function savePacket(packet: Packet, passphrase: string): Promise<EncryptedEnvelope> {
  const envelope = await encryptPacket(packet, passphrase);
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(envelope);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(new Error('Your packet could not be saved locally. Export a backup and check storage permissions.'));
  });
  db.close();
  return envelope;
}

export async function exportEnvelope(id: string): Promise<EncryptedEnvelope | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const request = tx.objectStore(STORE).get(id);
    request.onsuccess = () => resolve((request.result as EncryptedEnvelope | undefined) ?? null);
    request.onerror = () => reject(new Error('The encrypted backup could not be prepared.'));
    tx.oncomplete = () => db.close();
  });
}

export async function deletePacket(id: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(new Error('The local packet could not be deleted.'));
  });
  db.close();
}

export async function importEnvelope(value: unknown, passphrase: string): Promise<Packet> {
  if (!value || typeof value !== 'object') throw new Error('Choose an encrypted Closeout Kit JSON backup.');
  const envelope = value as EncryptedEnvelope;
  if (envelope.format !== 'closeout-kit-encrypted' || envelope.version !== 1 || !envelope.id) {
    throw new Error('This is not an encrypted Closeout Kit backup.');
  }
  const packet = await decryptPacket(envelope, passphrase);
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(envelope);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(new Error('The backup was valid but could not be saved.'));
  });
  db.close();
  return packet;
}
