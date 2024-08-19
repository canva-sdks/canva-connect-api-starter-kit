import type { Design } from "@canva/connect-api-ts/types.gen";
import { Box, CardContent, CardMedia, Typography } from "@mui/material";
import { useAppContext } from "src/context";
import { CanvaIcon } from "../canva-icon";
import { DemoButton } from "../demo-button";
import { useState } from "react";
import type { CorrelationState } from "src/models";
import { createNavigateToCanvaUrl } from "src/services/canva-return";

export const DesignResult = ({
  design,
  correlationStateOnNavigateToCanva,
}: {
  design: Design;
  correlationStateOnNavigateToCanva: CorrelationState;
}) => {
  const { selectedCampaignProduct } = useAppContext();
  const [isOpeningDesign, setIsOpeningDesign] = useState(false);
  return (
    <Box display="flex" padding={2} borderRadius={2}>
      <CardMedia
        component="img"
        sx={{
          width: 200,
          height: 200,
          borderRadius: 2,
          objectFit: "contain",
          bgcolor: "#302e35",
        }}
        image={design.thumbnail?.url ?? selectedCampaignProduct?.imageUrl}
        alt="autofill-image"
      />
      <Box display="flex" alignItems="center">
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="h6">{design.title}</Typography>
          <Box width={200}>
            <DemoButton
              demoVariant="secondary"
              startIcon={<CanvaIcon />}
              onClick={() => {
                setIsOpeningDesign(true);
                const navigateToCanvaUrl = createNavigateToCanvaUrl({
                  editUrl: design.urls.edit_url,
                  correlationState: correlationStateOnNavigateToCanva,
                });
                window.open(navigateToCanvaUrl, "_self");
              }}
              loading={isOpeningDesign}
              sx={{ width: "100%" }}
            >
              EDIT IN CANVA
            </DemoButton>
          </Box>
        </CardContent>
      </Box>
    </Box>
  );
};
