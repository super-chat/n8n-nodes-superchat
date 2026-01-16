import { defineConfig } from "tsdown";

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
  unbundle: true,
  format: ["cjs" as const],
  // n8n custom loader only scans for *.node.js / *.credentials.js
  outExtensions: () => ({ js: ".js" }),
  outDir: "dist",
  define: {
    __SUPERCHAT_API_DOMAIN: JSON.stringify(SUPERCHAT_API_DOMAIN),
  },
}));
