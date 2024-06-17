export type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
};

export type GetProductsResponse = {
  products: Product[];
};

export type ProductAutofillDataset = {
  name: {
    type: "TEXT";
    text: string;
  };
  image: {
    type: "IMAGE";
    asset_id: string;
  };
  price: {
    type: "TEXT";
    text: string;
  };
  discount: {
    type: "TEXT";
    text: string;
  };
};
