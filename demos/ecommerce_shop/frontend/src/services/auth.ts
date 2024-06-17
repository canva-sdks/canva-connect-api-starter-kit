import { BACKEND_HOST } from "src/config";

const endpoints = {
  AUTHORIZE: "/authorize",
  REVOKE: "/revoke",
  IS_AUTHORIZED: "/isauthorized",
};

export const getCanvaAuthorization = async () => {
  return new Promise<boolean>((resolve, reject) => {
    try {
      const url = new URL(endpoints.AUTHORIZE, BACKEND_HOST);
      const windowFeatures = ["popup", "height=800", "width=800"];
      const authWindow = window.open(url, "", windowFeatures.join(","));

      window.addEventListener("message", (event) => {
        if (event.data === "authorization_success") {
          resolve(true);
          authWindow?.close();
        } else if (event.data === "authorization_error") {
          reject(new Error("Authorization failed"));
          authWindow?.close();
        }
      });
      const checkAuth = async () => {
        try {
          const authorized = await checkAuthorizationStatus();
          resolve(authorized.status);
        } catch (error) {
          reject(error);
        }
      };

      // Some errors from authorizing may not redirect to our servers,
      // in that case we need to check to see if the window has been manually closed by the user.
      const checkWindowClosed = setInterval(() => {
        if (authWindow?.closed) {
          clearInterval(checkWindowClosed);
          checkAuth();
        }
      }, 1000);
    } catch (error) {
      console.error("Authorization failed", error);
      reject(error);
    }
  });
};

export const revoke = async () => {
  const url = new URL(endpoints.REVOKE, BACKEND_HOST);
  const response = await fetch(url, { credentials: "include" });

  if (!response.ok) {
    return false;
  }

  return true;
};

export const checkAuthorizationStatus = async (): Promise<{
  status: boolean;
}> => {
  const url = new URL(endpoints.IS_AUTHORIZED, BACKEND_HOST);
  const response = await fetch(url, { credentials: "include" });

  if (!response.ok) {
    return { status: false };
  }
  return response.json();
};
