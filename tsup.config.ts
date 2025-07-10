import { defineConfig } from "tsup";

declare var process: any;

const SUPERCHAT_API_DOMAIN =
  process.env.SUPERCHAT_API_DOMAIN || "api.superchat.com";

export default defineConfig((options) => ({
  entry: [
    "{credentials,nodes,types,utils}/**/*.ts",
    "!**/*.d.ts",
    "!**/*.test.ts",
  ],
  sourcemap: true,
  clean: options.clean ?? false,
  target: "es2019",
  bundle: false,
  format: ["cjs"],
  outDir: "dist",
  define: {
    "process.define.SUPERCHAT_API_DOMAIN": `"${SUPERCHAT_API_DOMAIN}"`,
  },
}));
