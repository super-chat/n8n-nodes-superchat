// `process.env.N8N_VERSION` will be set by n8n
// ``process.define.SUPERCHAT_API_DOMAIN`` needs to be handled by the bundler
declare var process: {
  env: {
    N8N_VERSION: any;
  };

  define: {
    SUPERCHAT_API_DOMAIN: string;
  };
};

export const BASE_URL = `https://${process.define.SUPERCHAT_API_DOMAIN}/v1.0`;

// Helper function to get n8n version that can be mocked in tests
export const getN8NVersion = (): string => {
  try {
    if (process.env.N8N_VERSION) {
      return process.env.N8N_VERSION;
    }
  } catch (error) {
    // Ignore error
  }

  return "0.0.0";
};

export const N8N_VERSION = getN8NVersion();

// Make sure this matches the version in package.json
export const NODE_VERSION = "0.2.4";
