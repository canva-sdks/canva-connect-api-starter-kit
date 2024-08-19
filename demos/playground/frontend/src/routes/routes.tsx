import type { RouteObject } from "react-router-dom";
import { ErrorBoundaryPage, HomePage, PlaygroundPage } from "src/pages";
import { App } from "../app";

export enum Paths {
  HOME = "/",
  PLAYGROUND = "/playground",
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
        path: Paths.PLAYGROUND,
        element: <PlaygroundPage />,
      },
    ],
  },
];
