export type ProductDesign = {
  /** CanvaId - design ID of the created design */
  designId: string;

  /** designEditUrl - the edit URL used to redirect to Canva on "Edit in Canva" */
  designEditUrl: string;

  /** designExportUrl - the downloaded URL of the exported Canva design. For the
   * demo this is a locally reachable URL from the express backend. In a production
   * production setting this should be a permanently stored image URL, such as an S3 URL.
   * Example of the locally reachable URL:
   * `http://127.0.0.1:3001/public/exports/3333-838106404244599455.png` */
  designExportUrl?: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  canvaDesign?: ProductDesign;
};

export type GetProductsResponse = {
  products: Product[];
};

export type UpsertProductDesignRequest = {
  productId: number;
  productDesign: ProductDesign;
};

export type UpsertProductDesignResponse = {
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
