const ALGO = { name: 'AES-GCM', length: 256 }

const bufferToHex = (buffer) =>
  Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('')

export async function deriveKey(masterPassword) {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(masterPassword),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('vault-salt-v1'), // In production: use a random stored salt
      iterations: 100_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    ALGO,
    false,
    ['encrypt', 'decrypt']
  )
}

export async function hashText(value) {
  const enc = new TextEncoder()
  const digest = await crypto.subtle.digest('SHA-256', enc.encode(value))

  return `sha256:${bufferToHex(digest)}`
}

// Encrypt a plaintext string, returns base64 string
export async function encryptText(plaintext, key) {
  const enc = new TextEncoder()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plaintext)
  )
  // Store iv + ciphertext together
  const combined = new Uint8Array(iv.byteLength + encrypted.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(encrypted), iv.byteLength)
  return btoa(String.fromCharCode(...combined))
}

// Decrypt a base64 string back to plaintext
export async function decryptText(base64, key) {
  const combined = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
  const iv = combined.slice(0, 12)
  const ciphertext = combined.slice(12)
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  )
  return new TextDecoder().decode(decrypted)
}
