# Fee Processing — personal engineering exercise

An older Node.js fee-calculation API I am rebuilding and testing. It is **not a production payment processor**.

## Try the static calculator

The `demo/` folder contains a self-contained, browser-only illustration of fees. It never sends money, contacts an API, or asks for customer details.

Open `demo/index.html` locally, or use the GitHub Pages deployment after the repository's **Settings → Pages → Source: GitHub Actions** is enabled and the deployment is verified.

To test this illustration without installing packages:

```bash
node --test demo/calc.test.cjs
```

The demo uses integer minor-unit arithmetic, checks invalid amounts and lets you switch who covers a fee. It is an educational example; it does not use a real provider's fee schedule.

## Legacy API

The original Node/Express API remains in the repository. A separate draft PR is improving request validation, calculation checks and error handling. Until reviewed, do not deploy it for real financial transactions.

The API's fee configuration is stored in local files, it uses floating-point arithmetic for some amounts, and it needs further work on data integrity and access controls.

## What's next

Verify the static GitHub Pages URL and mobile interaction, finish the backend regression checks, then compare the API calculation against known test cases. Only publish portfolio claims that have been demonstrated.
