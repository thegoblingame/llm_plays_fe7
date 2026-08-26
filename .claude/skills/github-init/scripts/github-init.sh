#!/bin/bash

# Initialize git repo, create GitHub repo, and push
# Usage: ./github-init.sh

FOLDER_NAME=$(basename "$PWD")

gh repo create "thegoblingame/${FOLDER_NAME}" --public --confirm

git init
git add .
git commit -m "repo initialized with claude github init skill"
git remote add origin git@github.com:thegoblingame/${FOLDER_NAME}.git
git push -u origin main
