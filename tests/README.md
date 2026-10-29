# Verification

Run the model regression tests with Node.js:

```powershell
$tests = Get-ChildItem tests -Filter '*.test.cjs' | ForEach-Object { $_.FullName }
node --test $tests
```

For browser checks, install Playwright locally (`npm install --no-save playwright`) and Google Chrome, then run from the repository root:

```sh
node tests/welcome-home-browser.cjs
node tests/planning-sync-browser.cjs
```

These tests use isolated browser contexts with file URLs, not your personal app storage. Planning screenshots go to ignored `test-output/`.

The broader onboarding browser suites normally start a local HTTP server. If localhost networking is blocked, set `FITLENS_TEST_FILE=1` before running `tests/onboarding-check.cjs` or `tests/notification-onboarding-check.cjs`.

`FITLENS_PLAYWRIGHT_MODULE` optionally selects an existing Playwright installation.
