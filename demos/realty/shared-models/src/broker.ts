export type Broker = {
  id: number;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  office: string;
  salesVolume: number;
  activeListings: number;
  specialty: string;
  imageUrl: string;
};

export type GetBrokersResponse = {
  brokers: Broker[];
};
