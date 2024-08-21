import { encrypt, decrypt, encodeBase64, decodeBase64 } from "./crypto";

describe("crypto", () => {
  it("Encryption throws an error if no encryption key is set", async () => {
    const text = "Hello World";
    await expect((async () => encrypt(text))()).rejects.toThrow();
  });

  it("A random string, once base-64 encoded, can be decoded to the same value", () => {
    const rando = new Uint8Array(16);
    crypto.getRandomValues(rando);
    const encoded = encodeBase64(rando);
    const decoded = decodeBase64(encoded);
    expect(decoded).toEqual(rando);
  });

  describe("Encrypt", () => {
    beforeEach(async () => {
      // Set up a non-at-all-random key for testing purposes
      process.env.DATABASE_ENCRYPTION_KEY = "aaaaaaaaaaaaaaaaaaaaaa";
    });

    it("After encrypting, returns the iv and token", async () => {
      const text = "Hello World";
      const encrypted = await encrypt(text);
      // Since the iv is random, and the encrypted text is encrypted, we can't
      // assert much more than that they exist.
      expect(encrypted.iv).not.toBe(undefined);
      expect(encrypted.encryptedData).not.toBe(undefined);
    });

    it("Can decrypt what it previously encrypted", async () => {
      const text = "Hello World";
      const encrypted = await encrypt(text);

      const decrypted = await decrypt(encrypted);
      expect(decrypted).toBe(text);
    });
  });
});
