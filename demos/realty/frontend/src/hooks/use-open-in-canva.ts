import { useCallback } from "react";
import { useAppContext } from "src/context";
import { createNavigateToCanvaUrl } from "src/services/canva-return";
import type { EditInCanvaPageOrigins } from "src/pages/return-nav";
import type { CorrelationState } from "src/pages/return-nav";

type UseOpenInCanvaParams = {
  originPage: EditInCanvaPageOrigins;
  returnTo: string;
};

export const useOpenInCanva = ({
  originPage,
  returnTo,
}: UseOpenInCanvaParams) => {
  const { addAlert, isAuthorized } = useAppContext();

  const openInCanva = useCallback(
    (flyer: { id: string; editUrl: string }) => {
      if (!isAuthorized) {
        addAlert({
          title: "Please connect to Canva first",
          variant: "warning",
          body: "You need to connect to Canva to edit flyers.",
        });
        return;
      }

      const correlationState: CorrelationState = {
        originPage,
        returnTo,
        flyerId: flyer.id,
      };

      const canvaUrl = createNavigateToCanvaUrl({
        editUrl: flyer.editUrl,
        correlationState,
      });

      window.location.assign(canvaUrl.toString());
    },
    [isAuthorized, addAlert, originPage, returnTo],
  );

  return { openInCanva, isAuthorized };
};
