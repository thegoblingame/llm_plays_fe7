#!/bin/bash

# Create a uv virtual environment and sync dependencies
# Usage: ./uv-init.sh

uv venv
source .venv/bin/activate
uv sync
