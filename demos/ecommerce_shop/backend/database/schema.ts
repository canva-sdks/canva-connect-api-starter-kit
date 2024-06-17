import type { Product } from "../models/product";
import type { EncryptedData } from "../services/crypto";

export type User = {
  // The Canva ID of the user
  id: string;
  // The Canva access and refresh token for the user
  token: EncryptedData;
};

export type DatabaseSchema = {
  products: Product[];
  users: User[];
};
