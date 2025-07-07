import { useEffect, useState } from "react";
import { Box, Typography, Grid, CircularProgress, Alert } from "@mui/material";
import { useAppContext } from "src/context";
import { getMyFlyers } from "src/services";
import type { FlyerDesign } from "@realty-demo/shared-models";
import { EditInCanvaPageOrigins } from "src/pages/return-nav";
import { CanvaIcon } from "src/components/canva-icon";
import {
  ConnectButton,
  PageHeader,
  GenericCard,
  DemoButton,
} from "src/components";
import { Paths } from "src/routes";
import GetAppIcon from "@mui/icons-material/GetApp";
import { CreateDesignButton } from "src/components/properties/create-design-button";
import { useOpenInCanva } from "src/hooks/use-open-in-canva";

const LOADING_DISPLAY_HEIGHT = 400;

export const DesignsPage = () => {
  const { addAlert } = useAppContext();
  const [designs, setDesigns] = useState<FlyerDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const { openInCanva, isAuthorized } = useOpenInCanva({
    originPage: EditInCanvaPageOrigins.DESIGNS,
    returnTo: Paths.DESIGNS,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthorized) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const designsResponse = await getMyFlyers();

        const sortedDesigns = (designsResponse.flyers || []).sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setDesigns(sortedDesigns);
      } catch (error) {
        console.error("Error fetching data:", error);
        addAlert({
          title: "Failed to load designs",
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthorized, addAlert]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={`${LOADING_DISPLAY_HEIGHT}px`}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthorized) {
    return (
      <Box paddingY={2}>
        <PageHeader title="Designs" />
        <Box sx={{ mt: 4 }}>
          <Alert severity="info" action={<ConnectButton />} sx={{ mb: 2 }}>
            <Typography variant="body1">
              Connect to Canva to create and manage your designs
            </Typography>
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box paddingY={2} height="100%" display="flex" flexDirection="column">
      <PageHeader title="Designs">
        {designs.length !== 0 && <CreateDesignButton />}
      </PageHeader>
      {designs.length === 0 && (
        <Box
          display="flex"
          flexGrow={1}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          <Typography
            variant="h6"
            color="textSecondary"
            gutterBottom={true}
            sx={{ mb: 2 }}
          >
            You haven't created any designs yet
          </Typography>
          <CreateDesignButton />
        </Box>
      )}
      <Grid container={true} spacing={2} paddingBottom={2} paddingTop={2}>
        {designs.map((flyer) => {
          return (
            <Grid item={true} xs={12} sm={6} md={4} key={flyer.id}>
              <GenericCard
                title={flyer.title}
                alt={flyer.title}
                subtitle={`Created: ${new Date(flyer.createdAt).toLocaleDateString()}`}
                images={flyer.thumbnailUrls}
                imageHeight={200}
              >
                <Box display="flex" flexDirection="column" gap={1}>
                  {isAuthorized && (
                    <DemoButton
                      demoVariant="primary"
                      onClick={() =>
                        openInCanva({
                          id: flyer.id,
                          editUrl: flyer.designEditUrl,
                        })
                      }
                      fullWidth={true}
                      startIcon={<CanvaIcon />}
                    >
                      Edit in Canva
                    </DemoButton>
                  )}
                  <DemoButton
                    demoVariant="secondary"
                    startIcon={<GetAppIcon />}
                    fullWidth={true}
                    onClick={() => {
                      // Just for display, not functional
                      addAlert({
                        title: "Download feature",
                        body: "This is a display-only button for demonstration purposes.",
                        variant: "info",
                      });
                    }}
                    sx={{ mt: 1 }}
                  >
                    Download
                  </DemoButton>
                </Box>
              </GenericCard>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
