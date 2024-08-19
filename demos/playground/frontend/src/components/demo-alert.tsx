import {
  Alert as MUIAlert,
  AlertTitle as MUIAlertTitle,
  IconButton,
  Typography,
} from "@mui/material";
import type {
  AlertColor as MUIAlertColor,
  AlertProps as MUIAlertProps,
  ButtonProps as MUIButtonProps,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface DemoAlertProps extends MUIAlertProps {
  alertTitle: React.ReactNode;
  alertBody?: React.ReactNode;
  onClose?: () => void;
  // ... add more project specific props here if should be extended.
}

const DEMO_ALERT_SEVERITY_COLOR: Record<
  MUIAlertColor,
  MUIButtonProps["color"]
> = {
  success: "primary", // "success" is not a color, hence the need for the definition here.
  info: "info",
  warning: "warning",
  error: "error",
};

/**
 * DemoAlert - implemented for consistent alert theming across the demo playground.
 * @param props - follows all the native MUIAlertProps from material-ui plus project
 *  specific props. E.g. alertTitle, alertBody + onClose (when provided will show a close
 *  action button, or when not close action will be hidden).
 * @returns a JSX Element that can be used with the demo shop styles baked in.
 */
export const DemoAlert = ({
  ...demoAlertProps
}: DemoAlertProps): JSX.Element => {
  const {
    alertTitle,
    alertBody,
    onClose,
    // Override different usage of MUIAlertProps by force unpacking different props here:
    action,
    children,
    severity = "success",
    sx,
    variant,
    ...remainingProps
  } = demoAlertProps;

  return (
    <MUIAlert
      variant="outlined"
      severity={severity}
      sx={{
        borderColor: DEMO_ALERT_SEVERITY_COLOR[severity],
        paddingY: 1,
        alignItems: "center",
        ...sx,
      }}
      action={
        onClose && (
          <IconButton
            color={DEMO_ALERT_SEVERITY_COLOR[severity]}
            aria-label="close"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        )
      }
      {...remainingProps}
    >
      <MUIAlertTitle
        color={DEMO_ALERT_SEVERITY_COLOR[severity]}
        sx={{ marginBottom: 0, paddingTop: "1px" }}
      >
        {alertTitle}
      </MUIAlertTitle>
      {alertBody && <Typography>{alertBody}</Typography>}
    </MUIAlert>
  );
};
