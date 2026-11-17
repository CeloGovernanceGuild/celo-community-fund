# Contributing

## Branches

| Branch | Purpose | Deploys to |
|---|---|---|
| `main` | Production. Only receives merges from `dev`. | Production |
| `dev` | Integration. Receives feature branches. | Preview |
| `feat/*`, `fix/*`, `data/*`, `chore/*` | One change each, branched from `dev`. | Preview |

Flow:

1. Branch from `dev`: `git checkout dev && git pull && git checkout -b data/add-initiative-x`
2. Open a pull request into `dev`.
3. When `dev` is ready to release, open a pull request from `dev` into `main`.

Both `dev` and `main` are protected by repository rulesets:

- Changes only through pull requests, no direct pushes, no force pushes, no deletion.
- Required status checks: `test-and-build` (`.github/workflows/ci.yml`) and
  `branch-flow` (`.github/workflows/branch-flow.yml`).
- `branch-flow` fails any pull request into `main` whose source is not `dev`.

## Commits

Conventional commits, lowercase, imperative, no trailing period:

```
feat(data): add mobile first community initiative
fix: handle negative funds available in chart
```

Types: feat, fix, docs, style, refactor, perf, test, chore, ci, build.

## Updating initiative data

All initiative data lives in `src/data`. Every change must be traceable to
governance:

- `drafts.js`: proposals not yet executed. Link the CGP.
- `active_initiatives.js`: executed spend approvals. Include the spender
  address from the proposal's `mainnet.json`, the approved amount and the
  proposal link.
- `completed_initiatives.js`: spend approvals fully used.

In the pull request, link the proposal, the execution transaction and the
spender address.

## Local checks

```sh
nvm use        # Node version from .nvmrc
npm ci
npm test
npm run build
npm run status # live on-chain status in the terminal
```
