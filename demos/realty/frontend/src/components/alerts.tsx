import type { AlertColor } from "@mui/material";
import { Box } from "@mui/material";
import { DemoAlert } from "src/components";
import { useAppContext } from "src/context";

/**
 * Base alert data structure used for displaying alerts
 */
export type ShopAlert = {
  /** Alert severity/color variant */
  variant: AlertColor;
  /** Alert title text */
  title: string;
  /** Optional alert body text */
  body?: string;
};

/**
 * Extended alert options with timing control
 */
export type ShopAlertOptions = ShopAlert & {
  /**
   * Time in milliseconds after which the alert will be hidden.
   * Default time is 4000ms, if set to -1, the alert will not hide.
   */
  hideAfterMs?: number;
};

/**
 * Alert container component that displays all active alerts
 * from the application context.
 */
export const Alerts = (): React.ReactNode => {
  const { alerts, clearAlert } = useAppContext();

  // No alerts - don't render anything
  if (alerts.length === 0) return null;

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      paddingBottom={2}
      role="alert" // Accessibility improvement
      aria-live="polite" // Announce changes to screen readers
    >
      {alerts.map((alert, index) => (
        <DemoAlert
          key={`alert-${index}-${alert.title}`}
          severity={alert.variant}
          alertTitle={alert.title}
          onClose={() => clearAlert(index)}
          alertBody={alert.body}
        />
      ))}
    </Box>
  );
};
