import { Stack } from "@mui/material";
import { DemoButton } from "src/components";

export const PublishCampaignButtons = ({
  onCancel,
  onPublish,
  publishDisabled,
}: {
  onCancel: () => void;
  onPublish: () => void;
  publishDisabled?: boolean;
}) => (
  <Stack direction="row" spacing={2}>
    <DemoButton demoVariant="destructive" fullWidth={true} onClick={onCancel}>
      CANCEL
    </DemoButton>
    <DemoButton
      demoVariant="primary"
      fullWidth={true}
      onClick={onPublish}
      disabled={publishDisabled}
    >
      PUBLISH CAMPAIGN
    </DemoButton>
  </Stack>
);
