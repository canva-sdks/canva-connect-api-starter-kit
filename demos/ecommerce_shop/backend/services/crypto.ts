export type EncryptedData = {
  // The text of the data, encrypted using AES-GCM
  encryptedData: string;
  // The initialization vector used to encrypt the data
  iv: string;
};

// exported for testing only
export function decodeBase64(text: string): Uint8Array {
  const buffer = Buffer.from(text, "base64");
  return Uint8Array.from(buffer);
}

// exported for testing only
export function encodeBase64(bytes: ArrayBuffer): string {
  return Buffer.from(bytes).toString("base64");
}

const ENCRYPTION_ALGORITHM = "AES-GCM";

/**
 * encrypt - Encrypt using AES-GCM (Galois/Counter Mode) with a 256-bit key
 * @param text The text you would like to encrypt
 * @returns A structure with the encrypted text and the initialization vector used to
 * encrypt (which will be needed to decrypt!)
 */
export async function encrypt(text: string): Promise<EncryptedData> {
  const rawKey = process.env.DATABASE_ENCRYPTION_KEY;

  if (!rawKey) {
    throw new Error("'DATABASE_ENCRYPTION_KEY' env variable not found.");
  }
  // To encrypt using AES-GCM we need an "initialization vector"
  // which is just "some other secure random data" used to seed the encryption process.
  // For more info on how GCM works see
  // https://en.wikipedia.org/wiki/Galois/Counter_Mode
  const iv = new Uint8Array(16);
  // Thankfully, webcrypto provides a great secure random number generator
  crypto.getRandomValues(iv);

  // We import the encryption key from the enviroment variable, letting webcrypto know
  // what algorithm (AES-GCM) and operations (encrypt, decrypt) the key is useful for.
  const key = await crypto.subtle.importKey(
    "raw",
    Buffer.from(rawKey, "base64"),
    {
      name: ENCRYPTION_ALGORITHM,
    },
    true,
    ["encrypt", "decrypt"],
  );
  // To encrypt, we need to supply the name of the encryption algorithm (AES-GCM here)
  // and the properties that algorithm needs (initialization vector for AES-GCM),
  // as well as the key itself.
  const encrypted = await crypto.subtle.encrypt(
    { name: ENCRYPTION_ALGORITHM, iv },
    key,
    new TextEncoder().encode(text),
  );
  // We need to store the initialization vector for decryption, but it's not considered
  // a "secret" so we can store it in plaintext.
  return {
    iv: encodeBase64(iv),
    encryptedData: encodeBase64(encrypted),
  };
}

/**
 * decrypt - Decrypt using AES-GCM and a 256-bit key
 * @param token A structure with the encrypted text and the initialization vector
 * @returns The decrypted text
 */
export async function decrypt(token: EncryptedData): Promise<string> {
  const rawKey = process.env.DATABASE_ENCRYPTION_KEY;

  if (!rawKey) {
    throw new Error("'DATABASE_ENCRYPTION_KEY' env variable not found.");
  }

  // We import the encryption key from the enviroment variable, letting webcrypto know
  // what algorithm (AES-GCM) and operations (encrypt, decrypt) the key is useful for.
  const key = await crypto.subtle.importKey(
    "raw",
    Buffer.from(rawKey, "base64"),
    {
      name: ENCRYPTION_ALGORITHM,
    },
    true,
    ["encrypt", "decrypt"],
  );
  // To decrypt, we need to supply the name of the encryption algorithm (AES-GCM here),
  // the initialization vector that was used to encrypt the data, and the key itself.
  const decrypted = await crypto.subtle.decrypt(
    { name: ENCRYPTION_ALGORITHM, iv: decodeBase64(token.iv) },
    key,
    decodeBase64(token.encryptedData),
  );
  return new TextDecoder("utf-8").decode(decrypted);
}
