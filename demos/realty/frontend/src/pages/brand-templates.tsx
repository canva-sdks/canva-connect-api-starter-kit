import {
  Box,
  Grid,
  CircularProgress,
  Alert,
  Typography,
  Link,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { BrandTemplate } from "@canva/connect-api-ts/types.gen";
import { PageHeader, ConnectButton, DemoButton } from "src/components";
import { BrandTemplateCard } from "src/components/brand-templates/brand-template-card";
import { useAppContext } from "src/context";
import { getBrandTemplates } from "src/services";
import { useNavigate } from "react-router-dom";
import { Paths } from "src/routes";

export const BrandTemplatesPage = () => {
  const { addAlert, isAuthorized } = useAppContext();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<BrandTemplate[]>();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!isAuthorized) return;

      try {
        setIsFetching(true);
        const result = await getBrandTemplates();

        if (!result.items.length) {
          addAlert({
            title: "No Brand Templates found.",
            variant: "info",
            body: "Create some Brand Templates in Canva to get started.",
          });
        } else {
          setTemplates(result.items);
        }
      } catch (error) {
        console.error(error);
        addAlert({
          title: "Something went wrong fetching Brand Templates.",
          variant: "error",
        });
      } finally {
        setIsFetching(false);
      }
    };
    fetchTemplates();
  }, [isAuthorized, addAlert]);

  const handleUseTemplateClick = (template: BrandTemplate) => {
    if (!isAuthorized) {
      addAlert({
        title: "Please connect to Canva first",
        variant: "warning",
        body: "You need to connect to Canva to use Brand Templates.",
      });
      return;
    }

    navigate(Paths.CONFIGURE_DESIGN, {
      state: { templateId: template.id },
    });
  };

  // Early return for unauthorized users
  if (!isAuthorized) {
    return (
      <Box paddingY={2}>
        <PageHeader title="Brand Templates" />
        <Box sx={{ mt: 4 }}>
          <Alert severity="info" action={<ConnectButton />} sx={{ mb: 2 }}>
            <Typography variant="body1">
              Connect to Canva to view and use your Brand Templates
            </Typography>
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box paddingY={2} height="100%" display="flex" flexDirection="column">
      <PageHeader title="Brand Templates" />

      <Paper
        variant="outlined"
        sx={{ padding: 2, bgcolor: "background.default", mb: 2 }}
      >
        <Typography variant="body2" color="text.secondary">
          Need sample Brand Templates? Install them from{" "}
          <Link
            href="https://www.canva.com/design/DAGGkcb61HQ/OJhMIQrmz2daIoxo8u3T2g/view"
            target="_blank"
            rel="noopener noreferrer"
          >
            this Brand Template deck
          </Link>
          .
        </Typography>
      </Paper>

      {templates?.length === 0 && (
        <Box
          py={4}
          textAlign="center"
          display="flex"
          flexDirection="column"
          alignItems="center"
          flexGrow={1}
          justifyContent="center"
          minHeight="100%"
        >
          <Typography
            variant="h6"
            color="textSecondary"
            gutterBottom={true}
            sx={{ mb: 2 }}
          >
            You don't have any Brand Templates yet.
          </Typography>
          <DemoButton
            demoVariant="primary"
            onClick={() => {
              window.open(
                "https://www.canva.com/design/DAGGkcb61HQ/OJhMIQrmz2daIoxo8u3T2g/view",
                "_blank",
              );
            }}
          >
            Get started with our guide
          </DemoButton>
        </Box>
      )}

      {isFetching && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={400}
        >
          <CircularProgress />
        </Box>
      )}

      {!isFetching && (
        <Grid container={true} spacing={2} paddingTop={2} paddingBottom={2}>
          {templates?.map((template) => (
            <Grid item={true} key={template.id} xs={12} sm={6} md={4} lg={4}>
              <BrandTemplateCard
                template={template}
                onClick={() => handleUseTemplateClick(template)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
