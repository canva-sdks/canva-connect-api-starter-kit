import { useState } from "react";
import { Box, Snackbar, Typography } from "@mui/material";
import { DemoButton } from "src/components";
import AddIcon from "@mui/icons-material/Add";

export const PageHeader = ({ title }: { title: string }) => {
  const [open, setOpen] = useState(false);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      paddingBottom={2}
    >
      <Typography variant="h4">{title}</Typography>
      <Box alignItems="center" display="flex">
        <DemoButton
          demoVariant="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          New Campaign
        </DemoButton>
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          message="This functionality is not implemented, and is for demonstration purposes only."
        />
      </Box>
    </Box>
  );
};
