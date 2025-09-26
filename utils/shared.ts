// `meta.injected.SUPERCHAT_API_DOMAIN` needs to be handled by the bundler
declare var meta: {
  injected: {
    SUPERCHAT_API_DOMAIN: string;
  };
};

export const BASE_URL = `https://${meta.injected.SUPERCHAT_API_DOMAIN}/v1.0`;

// Make sure this matches the version in package.json
export const NODE_VERSION = "0.2.6";
