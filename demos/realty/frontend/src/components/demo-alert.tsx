import {
  Alert as MUIAlert,
  AlertTitle as MUIAlertTitle,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import type {
  AlertColor as MUIAlertColor,
  AlertProps as MUIAlertProps,
  ButtonProps as MUIButtonProps,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/**
 * Props for the DemoAlert component
 */
export interface DemoAlertProps
  extends Omit<MUIAlertProps, "title" | "children"> {
  /** The title displayed at the top of the alert */
  alertTitle: React.ReactNode;
  /** Optional body content for the alert */
  alertBody?: React.ReactNode;
  /** Optional callback when close button is clicked */
  onClose?: () => void;
}

/**
 * Maps severity values to button colors
 */
const DEMO_ALERT_SEVERITY_COLOR: Record<
  MUIAlertColor,
  MUIButtonProps["color"]
> = {
  success: "primary", // "success" is not a color in button, using primary instead
  info: "info",
  warning: "warning",
  error: "error",
};

/**
 * A standardized alert component that provides consistent styling
 * and behavior across the application.
 *
 * @example
 * <DemoAlert
 *   severity="success"
 *   alertTitle="Operation successful"
 *   alertBody="Your changes have been saved."
 *   onClose={() => setAlertVisible(false)}
 * />
 */
export const DemoAlert = ({
  alertTitle,
  alertBody,
  onClose,
  // Explicitly destructured and ignored properties
  action: _action,
  severity = "success",
  sx,
  variant: _variant,
  ...remainingProps
}: DemoAlertProps): JSX.Element => {
  const theme = useTheme();

  // Define consistent alert styles
  const alertStyles = {
    borderColor: DEMO_ALERT_SEVERITY_COLOR[severity],
    paddingY: 1,
    alignItems: "center",
    ...(sx || {}),
  };

  // Alert title styles
  const titleStyles = {
    marginBottom: 0,
    paddingTop: "1px",
    color: DEMO_ALERT_SEVERITY_COLOR[severity]
      ? theme.palette[DEMO_ALERT_SEVERITY_COLOR[severity]]?.main
      : undefined,
  };

  // Close button when onClose is provided
  const closeButton = onClose && (
    <IconButton
      color={DEMO_ALERT_SEVERITY_COLOR[severity]}
      aria-label="close"
      onClick={onClose}
    >
      <CloseIcon />
    </IconButton>
  );

  return (
    <MUIAlert
      variant="outlined"
      severity={severity}
      sx={alertStyles}
      action={closeButton}
      {...remainingProps}
    >
      <MUIAlertTitle sx={titleStyles}>{alertTitle}</MUIAlertTitle>
      {alertBody && <Typography variant="body2">{alertBody}</Typography>}
    </MUIAlert>
  );
};
