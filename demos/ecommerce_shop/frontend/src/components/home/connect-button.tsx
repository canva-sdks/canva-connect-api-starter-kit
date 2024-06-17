import { useState, useEffect } from "react";
import { DemoButton } from "src/components";
import { useAppContext } from "src/context";
import { getCanvaAuthorization, getUser, revoke } from "src/services";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { CanvaIcon } from "src/components";

export const ConnectButton = () => {
  const {
    isAuthorized,
    setIsAuthorized,
    setDisplayName,
    setErrors,
    setShowSuccessfulConnectionAlert,
  } = useAppContext();
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
        setShowSuccessfulConnectionAlert(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error(error);
      setIsAuthorized(false);
      setErrors((prevState) =>
        prevState.concat("Authorization has failed. Please try again later."),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onRevokeClick = async () => {
    const result = await revoke();

    if (result) {
      setIsAuthorized(false);
      setDisplayName("");
      setShowSuccessfulConnectionAlert(false);
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
