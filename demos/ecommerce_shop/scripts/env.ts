const envVars = [
  "BACKEND_PORT",
  "BACKEND_URL",
  "FRONTEND_URL",
  "CANVA_CLIENT_ID",
  "CANVA_CLIENT_SECRET",
  "DATABASE_ENCRYPTION_KEY",
];

export const validateEnvironmentVariables = () => {
  envVars.forEach((envVar) => {
    if (process.env[envVar] == null) {
      throw new Error(
        `Environment variable '${envVar}' not found. Please refer to the README for more instructions.`,
      );
    }

    if (process.env[envVar] === `<${envVar}>`) {
      throw new Error(
        `Placeholder environment variable for '${envVar}' detected. Please refer to the README for more instructions.`,
      );
    }
  });
};
