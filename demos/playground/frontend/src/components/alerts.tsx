import type { AlertColor } from "@mui/material";
import { Box } from "@mui/material";
import { DemoAlert } from "src/components";
import { useAppContext } from "src/context";

export type ShopAlert = {
  variant: AlertColor;
  title: string;
  body?: string;
};

export type ShopAlertOptions = ShopAlert & {
  /**
   * hideAfterMs - time in milliseconds the alert will be hidden.
   * Default time is 4000ms, if set to -1, the alert will not hide.
   */
  hideAfterMs?: number;
};

export const Alerts = () => {
  const { alerts, clearAlert } = useAppContext();

  return (
    <>
      <Box display="flex" flexDirection="column" gap={2} paddingBottom={2}>
        {alerts.map((alert, index) => (
          <DemoAlert
            key={`${alert.title}-${index}`}
            severity={alert.variant}
            alertTitle={alert.title}
            onClose={() => clearAlert(index)}
            alertBody={alert.body}
          />
        ))}
      </Box>
    </>
  );
};
