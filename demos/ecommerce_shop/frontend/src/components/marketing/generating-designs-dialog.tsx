import type { CircularProgressProps } from "@mui/material";
import { Box, CircularProgress, Dialog, Typography } from "@mui/material";

export const GeneratingDesignsDialog = ({
  isOpen,
  progress,
}: {
  isOpen: boolean;
  progress: number | undefined;
}) => (
  <Dialog open={isOpen} maxWidth="md" fullWidth={true}>
    <Box
      padding={6}
      display="flex"
      alignContent="center"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
    >
      <CircularProgressWithLabel value={progress ?? 0} />
      <Typography variant="h4" gutterBottom={true}>
        Generating designs
      </Typography>
      <Typography variant="body2">
        Please do not refresh or close the window
      </Typography>
    </Box>
  </Dialog>
);

const CircularProgressWithLabel = (
  props: CircularProgressProps & { value: number },
) => (
  <Box position="relative" display="inline-flex">
    <CircularProgress variant="determinate" {...props} />
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="absolute"
      top={0}
      left={0}
      bottom={0}
      right={0}
    >
      <Typography
        variant="caption"
        component="div"
        color="text.secondary"
      >{`${Math.round(props.value)}%`}</Typography>
    </Box>
  </Box>
);
