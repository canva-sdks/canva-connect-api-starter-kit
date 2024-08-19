import type { BrandTemplate } from "@canva/connect-api-ts/types.gen";
import { createContext, useContext, useState } from "react";

export interface CampaignContextType {
  campaignName: string;
  setCampaignName: (campaignName: string) => void;
  selectedDiscount: string;
  setSelectedDiscount: (discount: string) => void;
  selectedBrandTemplates: BrandTemplate[];
  setSelectedBrandTemplates: (brandTemplates: BrandTemplate[]) => void;
}

export const CampaignContext = createContext<CampaignContextType>({
  campaignName: "",
  setCampaignName: () => {},
  selectedDiscount: "10%",
  setSelectedDiscount: () => {},
  selectedBrandTemplates: [],
  setSelectedBrandTemplates: () => {},
});

const getDefaultCampaignName = () => {
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  return `Deal of the month - ${currentMonth}`;
};

export const CampaignContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [campaignName, setCampaignName] = useState<string>(
    getDefaultCampaignName(),
  );
  const [selectedDiscount, setSelectedDiscount] = useState<string>("10%");
  const [selectedBrandTemplates, setSelectedBrandTemplates] = useState<
    BrandTemplate[]
  >([]);

  const value: CampaignContextType = {
    campaignName,
    setCampaignName,
    selectedDiscount,
    setSelectedDiscount,
    selectedBrandTemplates,
    setSelectedBrandTemplates,
  };

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaignContext = (): CampaignContextType => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error(
      "useCampaignContext must be used within a CampaignContextProvider",
    );
  }
  return context;
};
