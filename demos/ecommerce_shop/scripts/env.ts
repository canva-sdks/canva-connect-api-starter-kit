const envVars = [
  "BACKEND_PORT",
  "BACKEND_URL",
  "FRONTEND_URL",
  "CANVA_CLIENT_ID",
  "CANVA_CLIENT_SECRET",
  "DATABASE_ENCRYPTION_KEY",
  "BASE_CANVA_CONNECT_API_URL",
];

export const validateEnvironmentVariables = () => {
  envVars.forEach((envVar) => {
    if (process.env[envVar] == null) {
      throw new Error(
        `Environment variable '${envVar}' not found. Please refer to the README for more instructions and ensure your '.env' file is up to date with '.env.template'.`,
      );
    }

    if (process.env[envVar] === `<${envVar}>`) {
      throw new Error(
        `Placeholder environment variable for '${envVar}' detected. Please refer to the README for more instructions.`,
      );
    }
  });
};
