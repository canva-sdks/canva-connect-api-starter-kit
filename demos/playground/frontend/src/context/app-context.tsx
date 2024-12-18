import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { Services } from "src/services";
import { checkForAccessToken, installServices } from "src/services";
import type { ShopAlert, ShopAlertOptions } from "src/components";

export interface AppContextType {
  isAuthorized: boolean;
  displayName: string;
  setDisplayName: Dispatch<SetStateAction<string>>;
  alerts: ShopAlert[];
  /** addAlert: a method to surface a new alert in header of a page. Auto hides after 4s unless overridden.  */
  addAlert: (newAlert: ShopAlertOptions) => void;
  /** clearAlert: remove alert based on the index from the alerts array.  */
  clearAlert: (alertIndex: number) => void;
  services: Services;
  setToken: Dispatch<SetStateAction<string | undefined>>;
}

export const AppContext = createContext<AppContextType>({
  isAuthorized: false,
  displayName: "",
  setDisplayName: () => {},
  alerts: [],
  addAlert: (alert: ShopAlertOptions) => {},
  clearAlert: (alertIndex: number) => {},
  services: installServices(),
  setToken: () => {},
});

export const ContextProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [displayName, setDisplayName] = useState("");
  const [alerts, setAlerts] = useState<ShopAlert[]>([]);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const { token } = await checkForAccessToken();
        setToken(token);
      } catch (error) {
        console.error(error);
        console.error("Error checking authorization:", error);
      }
    };

    checkAuthorization();
  }, []);

  const addAlert = (newAlert: ShopAlertOptions) => {
    setAlerts((currentAlerts) => [newAlert, ...currentAlerts]);
    const hideTime = newAlert.hideAfterMs ?? 4000;
    if (hideTime > -1) {
      setTimeout(() => {
        setAlerts((currentAlerts) =>
          currentAlerts.filter((t) => t.title !== newAlert.title),
        );
      }, hideTime);
    }
  };

  const clearAlert = (alertIndex: number) => {
    setAlerts((currentAlerts) =>
      currentAlerts.filter((_, index) => index !== alertIndex),
    );
  };

  const services = installServices(token);
  const isAuthorized = !!token;

  const value: AppContextType = {
    isAuthorized,
    displayName,
    setDisplayName,
    alerts,
    addAlert,
    clearAlert,
    services,
    setToken,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a ContextProvider");
  }
  return context;
};
