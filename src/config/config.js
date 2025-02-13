import localConfig from "./environments/local";
import prodConfig from "./environments/prod";

const environment = import.meta.env.VITE_ENV;
let config;

switch (environment) {
  case "local":
    config = localConfig;
    break;
  case "production":
    config = prodConfig;
    break;
  default:
    throw new Error(`Unknown environment: ${environment}`);
}

export default config;