# Developing against staging / a local API

You can set the `SUPERCHAT_API_DOMAIN` environment variable when running the `pnpm build` or `pnpm dev` commands,
to override the production API domain (`api.superchat.com`).

# Run you code locally

See the [n8n docs](https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/) on running this node locally.

## Sending requests to the staging API instead of the production API

To send requests to the staging API, please update the base url in the [./src/shared.ts](./src/shared.ts) file, then rebuild the n8n node and restart your local n8n application.

Make sure to not commit the updated base URL.

## Receiving webhooks locally

To receive webhooks locally use a tool like ngrok, then set the `WEBHOOK_URL` environment variable for n8n.

1. Run ngrok with port n8n is running under (default 5678)

```
ngrok http 5678
```

2. Set the `WEBHOOK_URL` environment variable when starting n8n.

```
WEBHOOK_URL=XXX n8n start
```

# Git hooks

This repository manages git hooks through [pre-commit](https://pre-commit.com). To activate the git hooks, run `pre-commit install`

# Release process

To release a new version follow the following process.

1. Update the version in the package.json and code manually
2. Update the [./CHANGELOG.md](./CHANGELOG.md) file to document the changes. Make sure the changelog mentions the exact version prefixed with a v (e.g. v0.1.0). The CI pipeline will later validate this!
3. Add a git tag for the version prefixed with v (e.g. v0.1.0)
4. Push the commit and tag
5. The release CI pipeline should now do the rest, see [./.github/workflows/release.yml](./.github/workflows/release.yml)
