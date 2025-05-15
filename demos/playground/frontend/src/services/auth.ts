const endpoints = {
  AUTHORIZE: "/authorize",
  REVOKE: "/revoke",
  TOKEN: "/token",
};

export const getCanvaAuthorization = async () => {
  return new Promise<string | undefined>((resolve, reject) => {
    try {
      const url = new URL(endpoints.AUTHORIZE, process.env.BACKEND_URL);
      const windowFeatures = ["popup", "height=800", "width=800"];
      const authWindow = window.open(url, "", windowFeatures.join(","));

      const checkAuth = async () => {
        try {
          const authorized = await checkForAccessToken();
          resolve(authorized.token);
        } catch (error) {
          reject(error);
        }
      };

      window.addEventListener("message", (event) => {
        if (event.data === "authorization_success") {
          checkAuth();
          authWindow?.close();
        } else if (event.data === "authorization_error") {
          reject(new Error("Authorization failed"));
          authWindow?.close();
        }
      });

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
  const url = new URL(endpoints.REVOKE, process.env.BACKEND_URL);
  const response = await fetch(url, { credentials: "include" });

  if (!response.ok) {
    return false;
  }

  return true;
};

export const checkForAccessToken = async (): Promise<{
  token?: string;
}> => {
  const url = new URL(endpoints.TOKEN, process.env.BACKEND_URL);
  const response = await fetch(url, { credentials: "include" });

  if (!response.ok) {
    return { token: undefined };
  }
  return { token: await response.text() };
};
