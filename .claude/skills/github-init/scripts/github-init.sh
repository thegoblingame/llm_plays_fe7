#!/bin/bash

# Initialize git repo and push to GitHub remote
# Usage: ./github-init.sh

FOLDER_NAME=$(basename "$PWD")

git init
git add .
git commit -m "repo initialized with claude github init skill"
git remote add origin git@github.com:thegoblingame/${FOLDER_NAME}.git
git push -u origin main
