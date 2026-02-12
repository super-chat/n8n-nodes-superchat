// `__SUPERCHAT_API_DOMAIN` needs to be handled by the bundler
declare var __SUPERCHAT_API_DOMAIN: string;

export const BASE_URL = `https://${__SUPERCHAT_API_DOMAIN}/v1.0`;

// Make sure this matches the version in package.json
export const NODE_VERSION = "0.4.0";
