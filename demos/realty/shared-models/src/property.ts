export type PropertyDesign = {
  /** CanvaId - design ID of the created design */
  designId: string;

  /** designEditUrl - the edit URL used to redirect to Canva on "Edit in Canva" */
  designEditUrl: string;

  /** designExportUrl - the downloaded URL of the exported Canva design. For the
   * demo this is a locally reachable URL from the express backend. In a production
   * production setting this should be a permanently stored image URL, such as an S3 URL.
   * Example of the locally reachable URL:
   * `http://127.0.0.1:3001/public/exports/3333-838106404244599455.png` */
  designExportUrls?: string[];
};

export type Property = {
  id: number;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  carSpots: number;
  squareFeet: number;
  description: string;
  type:
    | "single-family"
    | "condo"
    | "townhouse"
    | "multi-family"
    | "land"
    | "other";
  status: "for-sale" | "for-rent" | "pending" | "sold" | "leased";
  imageUrls: string[];
};

export type GetPropertiesResponse = {
  properties: Property[];
};

export type GetPropertyResponse = {
  property: Property;
};

export type DatasetTextValue = {
  type: "text";
  text: string;
};

export type DatasetImageValue = {
  type: "image";
  asset_id: string;
};

export type DatasetValue = DatasetTextValue | DatasetImageValue;

// More flexible dataset type
export type PropertyAutofillDataset = {
  [key: string]: DatasetValue;
};
