import * as fs from "fs";
import * as path from "path";

type CliArgs = {
  example?: string;
  ngrok?: boolean;
};

export class Context {
  constructor(
    private readonly args: CliArgs,
    private readonly rootDir: string,
  ) {}

  get srcDir() {
    const src = path.join(this.rootDir, "frontend", "src");

    if (!fs.existsSync(src)) {
      throw new Error(`Directory does not exist: ${src}`);
    }

    return src;
  }

  get backendEntry() {
    const index = path.join(this.rootDir, "backend", "index.ts");

    if (!fs.existsSync(index)) {
      throw new Error(`backend/index.ts does not exist: ${index}`);
    }

    return index;
  }

  get ngrokEnabled() {
    return !!this.args.ngrok;
  }

  get frontendUrl(): string {
    return process.env.FRONTEND_URL!;
  }

  get backendUrl(): string {
    return process.env.BACKEND_URL!;
  }

  get backendPort(): string {
    return process.env.BACKEND_PORT!;
  }
}
