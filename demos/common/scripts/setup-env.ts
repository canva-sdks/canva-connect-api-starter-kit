import * as fs from "fs";
import * as path from "path";

const cwd = process.cwd();
const envFile = path.resolve(cwd, ".env");
const templateFile = path.resolve(cwd, ".env.template");

fs.access(templateFile, fs.constants.F_OK, (templateErr) => {
  if (templateErr) {
    console.error(".env.template file does not exist in the current directory");
    process.exit(1);
  }

  // Check if the .env file exists
  fs.access(envFile, fs.constants.F_OK, (envErr) => {
    if (!envErr) {
      // already exists, nothing to do
      return;
    }

    // .env file does not exist, copy .env.template to .env
    fs.copyFile(templateFile, envFile, (copyErr) => {
      if (copyErr) {
        console.error("Error copying .env.template to .env:", copyErr);
      }
    });
  });
});
