export const BASE_URL = "https://api.superchat.com/v1.0";

// Support using `process.env.N8N_VERSION`
declare var process: {
  env: {
    N8N_VERSION: any;
  };
};

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
export const NODE_VERSION = "0.1.0";
