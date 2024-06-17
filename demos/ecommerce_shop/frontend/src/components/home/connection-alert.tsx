import { useEffect } from "react";
import { DemoAlert } from "src/components";
import { useAppContext } from "src/context";

export const ConnectionAlert = () => {
  const {
    displayName,
    showSuccessfulConnectionAlert,
    setShowSuccessfulConnectionAlert,
  } = useAppContext();

  useEffect(() => {
    // close alert when navigating to other pages
    return () => setShowSuccessfulConnectionAlert(false);
  }, []);

  if (!showSuccessfulConnectionAlert) {
    return null;
  }

  return (
    <DemoAlert
      severity="success"
      alertTitle={
        <>
          The Canva for <b>Nourish</b> integration is now connected
        </>
      }
      alertBody={
        displayName && <>You're currently logged in as {displayName}.</>
      }
      onClose={() => setShowSuccessfulConnectionAlert(false)}
      sx={{ marginBottom: 2 }}
    />
  );
};
