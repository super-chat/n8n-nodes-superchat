# Run you code locally

See the [n8n docs](https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/) on running this node locally.

## Sending requests to the staging API instead of the production API

To send requests to the staging API, please update the base url in the [./src/shared.ts](./src/shared.ts) file, then rebuild the n8n node and restart your local n8n application.

Make sure to not commit the updated base URL.
