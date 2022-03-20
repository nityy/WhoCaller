# WhoCaller

A minimal frontend for Truecaller to search whether a number is spam or not. This emulates requests what the official app would make. Unofficial API is also provided.

Public Instance: [whocaller.fly.dev](https://whocaller.fly.dev/)

## CLI

I also made a standalone command line tool (available in `cli` folder) for personal usage. It also shows name, email, region unlike the webapp which (deliberately, for privacy reasons) shows only spam details. The CLI requires `curl` and `jq`. It expects a environment variable `CALLER_TOKEN`.

## Installation

To run, you'll need to set `CALLER_TOKEN` environment variable which you can get from inspecting the app traffic after logging in the official app. It is the bearer token found in `Authentication` header.