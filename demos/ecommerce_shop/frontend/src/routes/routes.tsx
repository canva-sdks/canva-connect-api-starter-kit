import type { RouteObject } from "react-router-dom";
import { CampaignContextProvider } from "src/context";
import {
  ErrorBoundaryPage,
  HomePage,
  MarketingPage,
  MultipleDesignsGeneratorPage,
  ProductsPage,
  SingleDesignGeneratorPage,
} from "src/pages";
import { App } from "../app";

export enum Paths {
  HOME = "/",
  MARKETING = "/marketing",
  MULTIPLE_DESIGNS_GENERATOR = "/marketing/multiple-designs",
  PRODUCTS = "/products",
  SINGLE_DESIGN_GENERATOR = "/marketing/single-design",
}

export const routes: RouteObject[] = [
  {
    path: Paths.HOME,
    element: <App />,
    errorElement: <ErrorBoundaryPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: Paths.PRODUCTS,
        element: <ProductsPage />,
      },
      {
        path: Paths.MARKETING,
        element: <MarketingPage />,
      },
      {
        path: Paths.SINGLE_DESIGN_GENERATOR,
        element: (
          <CampaignContextProvider>
            <SingleDesignGeneratorPage />
          </CampaignContextProvider>
        ),
      },
      {
        path: Paths.MULTIPLE_DESIGNS_GENERATOR,
        element: (
          <CampaignContextProvider>
            <MultipleDesignsGeneratorPage />
          </CampaignContextProvider>
        ),
      },
    ],
  },
];
