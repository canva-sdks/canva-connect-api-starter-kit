import { Typography, Box, Stack, Dialog } from "@mui/material";
import { DemoButton, DeveloperNote } from "src/components";
import { useCampaignContext } from "src/context";

export const PublishDialog = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) => {
  const { campaignName } = useCampaignContext();

  return (
    <Dialog
      open={isOpen}
      onClose={() => onOpenChange(false)}
      maxWidth="sm"
      PaperProps={{ sx: { bgcolor: "black" } }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
        gap={2}
        paddingTop={6}
        paddingBottom={6}
      >
        <Box
          width={600}
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
        >
          <Typography variant="h6">Your campaign ‘{campaignName}’</Typography>
          <Typography variant="h6">has been published!</Typography>
        </Box>
        <Box width={400}>
          <Stack spacing={2}>
            <DeveloperNote info="This is for demo purposes only, the campaign is not really published anywhere" />
            <DemoButton
              demoVariant="primary"
              onClick={() => onOpenChange(false)}
            >
              CLOSE
            </DemoButton>
          </Stack>
        </Box>
      </Box>
    </Dialog>
  );
};
