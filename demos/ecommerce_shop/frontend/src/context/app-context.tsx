import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { checkAuthorizationStatus } from "src/services";

export interface AppContextType {
  isAuthorized: boolean;
  setIsAuthorized: Dispatch<SetStateAction<boolean>>;
  displayName: string;
  setDisplayName: Dispatch<SetStateAction<string>>;
  errors: string[];
  setErrors: Dispatch<SetStateAction<string[]>>;
  showSuccessfulConnectionAlert: boolean;
  setShowSuccessfulConnectionAlert: Dispatch<SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextType>({
  isAuthorized: false,
  setIsAuthorized: () => {},
  displayName: "",
  setDisplayName: () => {},
  errors: [],
  setErrors: () => {},
  showSuccessfulConnectionAlert: false,
  setShowSuccessfulConnectionAlert: () => {},
});

export const ContextProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [showSuccessfulConnectionAlert, setShowSuccessfulConnectionAlert] =
    useState<boolean>(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const { status } = await checkAuthorizationStatus();
        setIsAuthorized(status);
      } catch (error) {
        console.error("Error checking authorization:", error);
      }
    };

    checkAuthorization();
  }, []);

  const value: AppContextType = {
    isAuthorized,
    setIsAuthorized,
    displayName,
    setDisplayName,
    errors,
    setErrors,
    showSuccessfulConnectionAlert,
    setShowSuccessfulConnectionAlert,
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
