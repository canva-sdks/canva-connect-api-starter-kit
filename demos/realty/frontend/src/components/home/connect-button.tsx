import { useState, useCallback } from "react";
import { DemoButton } from "src/components";
import { useAppContext } from "src/context";
import { getCanvaAuthorization, getUser, revoke } from "src/services";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { CanvaIcon } from "src/components";

/**
 * Component that provides Canva connection functionality
 * Displays either Connect or Disconnect button based on authorization status
 */
type ConnectButtonProps = {
  fullWidth?: boolean;
};

export const ConnectButton = ({
  fullWidth = true,
}: ConnectButtonProps): JSX.Element => {
  const { isAuthorized, setIsAuthorized, addAlert } = useAppContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Handle Connect to Canva button click
   * Initiates the authorization process with Canva
   */
  const handleConnect = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const result = await getCanvaAuthorization();

      if (result) {
        setIsAuthorized(true);
        const { profile } = await getUser();
        addAlert({
          title: "The Brix & Hart integration is now connected",
          body: `You're currently logged in as ${profile.display_name}.`,
          variant: "success",
          hideAfterMs: 5000,
        });
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error("Authorization failed:", error);
      setIsAuthorized(false);
      addAlert({
        title: "Authorization has failed. Please try again later.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [setIsAuthorized, addAlert, setIsLoading]);

  /**
   * Handle Disconnect from Canva button click
   * Revokes the authorization with Canva
   */
  const handleDisconnect = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const result = await revoke();

      if (result) {
        setIsAuthorized(false);
        addAlert({
          title: "Your Canva integration has been disconnected",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Failed to disconnect:", error);
      addAlert({
        title: "Failed to disconnect. Please try again.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [setIsAuthorized, addAlert, setIsLoading]);

  /**
   * Get the appropriate button properties based on connection status
   */
  const getButtonProps = () => {
    if (isAuthorized) {
      // adjust colors to match
      return {
        demoVariant: "destructive" as const,
        startIcon: <LinkOffIcon />,
        onClick: handleDisconnect,
        label: "Disconnect",
        ariaLabel: "Disconnect from Canva",
      };
    } else {
      return {
        demoVariant: "primary" as const,
        startIcon: <CanvaIcon />,
        onClick: handleConnect,
        label: "Connect to Canva",
        ariaLabel: "Connect to Canva",
      };
    }
  };

  const { demoVariant, startIcon, onClick, label, ariaLabel } =
    getButtonProps();

  return (
    <DemoButton
      demoVariant={demoVariant}
      startIcon={startIcon}
      onClick={onClick}
      loading={isLoading}
      fullWidth={fullWidth}
      size="small"
      aria-label={ariaLabel}
    >
      {label}
    </DemoButton>
  );
};
