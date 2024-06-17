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
    type: "text";
    text: string;
  };
  image: {
    type: "image";
    asset_id: string;
  };
  price: {
    type: "text";
    text: string;
  };
  discount: {
    type: "text";
    text: string;
  };
};
