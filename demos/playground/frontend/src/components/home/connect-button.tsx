import { useState, useEffect } from "react";
import { DemoButton } from "src/components";
import { useAppContext } from "src/context";
import { getCanvaAuthorization, getUser, revoke } from "src/services";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { CanvaIcon } from "src/components";

export const ConnectButton = () => {
  const { isAuthorized, setIsAuthorized, setDisplayName, addAlert } =
    useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAndSetDisplayName = async () => {
      const {
        profile: { display_name },
      } = await getUser();
      display_name && setDisplayName(display_name);
    };

    if (isAuthorized) {
      try {
        getAndSetDisplayName();
      } catch (error) {
        console.error(error);
      }
    }
  }, [isAuthorized]);

  const onConnectClick = async () => {
    try {
      setIsLoading(true);
      const result = await getCanvaAuthorization();

      if (result) {
        setIsAuthorized(true);
        const { profile } = await getUser();
        addAlert({
          title: "The Canva for Nourish integration is now connected",
          body: `You're currently logged in as ${profile.display_name}.`,
          variant: "success",
          hideAfterMs: 5000,
        });
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error(error);
      setIsAuthorized(false);
      addAlert({
        title: "Authorization has failed. Please try again later.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRevokeClick = async () => {
    const result = await revoke();

    if (result) {
      setIsAuthorized(false);
      setDisplayName("");
      addAlert({
        title: "Your Canva integration has been disconnected",
        variant: "info",
      });
    }
  };

  return isAuthorized ? (
    <DemoButton
      demoVariant="destructive"
      startIcon={<LinkOffIcon />}
      onClick={onRevokeClick}
      fullWidth={true}
    >
      DISCONNECT FROM CANVA
    </DemoButton>
  ) : (
    <DemoButton
      demoVariant="primary"
      startIcon={<CanvaIcon />}
      onClick={onConnectClick}
      loading={isLoading}
      fullWidth={true}
    >
      CONNECT TO CANVA
    </DemoButton>
  );
};
