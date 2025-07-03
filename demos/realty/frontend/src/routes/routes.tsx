import type { RouteObject } from "react-router-dom";
import {
  ErrorBoundaryPage,
  PropertiesPage,
  ReturnNavPage,
  DesignsPage,
  BrandTemplatesPage,
  ConfigureDesignPage,
} from "src/pages";
import { App } from "../app";

export enum Paths {
  ROOT = "/",
  RETURN_NAV = "/return-nav",
  PROPERTIES = "/properties",
  DESIGNS = "/designs",
  BRAND_TEMPLATES = "/brand-templates",
  CONFIGURE_DESIGN = "/configure-design",
}

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorBoundaryPage />,
    children: [
      {
        index: true,
        element: <PropertiesPage />,
      },
      {
        path: Paths.PROPERTIES,
        element: <PropertiesPage />,
      },
      {
        path: Paths.DESIGNS,
        element: <DesignsPage />,
      },
      {
        path: Paths.BRAND_TEMPLATES,
        element: <BrandTemplatesPage />,
      },
      {
        path: Paths.CONFIGURE_DESIGN,
        element: <ConfigureDesignPage />,
      },
    ],
  },
  {
    path: Paths.RETURN_NAV,
    errorElement: <ErrorBoundaryPage />,
    element: <ReturnNavPage />,
  },
];
