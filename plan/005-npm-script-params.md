# 005-npm-script-params.md

## Steps

1. Add npm scripts for dev and test that accept parameters for NODE_ENV and VITE_BACKEND.
2. Update documentation to explain how to use the scripts with parameters.
3. Ensure .env files are used for default values, but allow overrides via CLI.

## Ask questions

- Should the scripts default to .env.development/.env.test, or always require explicit parameters?
  - Option 1: Default to .env files (recommended, matches Vite convention)
  - Option 2: Always require explicit parameters
- Should NODE_ENV be set for both dev and test, or only for test?
  - Option 1: Both (recommended for clarity)
  - Option 2: Only for test
- Should we add example commands to README?
  - Option 1: Yes (recommended)
  - Option 2: No

If you want to change any of these, reply with -> MY_ANSWER and your choices.
