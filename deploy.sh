#!/bin/bash

# Manual deploy script to compile everything with 'production' mode
# and pushes the compiled material to the gh-pages branch.
# intended to be used only by the project owner.

set -e # exit with nonzero exit code if anything fails

# Clear and re-create the output directory
rm -rf built || exit 0;
mkdir built;

# Run our compile script
NODE_ENV=production webpack

# Go to the built directory and create a *new* Git repo
cd built

git init
git config user.name "yukihop"
git config user.email "mobacure.black@gmail.com"

# Make the first and only commit to this new Git repo
git add .
git commit -m "Deploy to GitHub Pages"

# Force push from the current repo's master branch to the remote
# repo's gh-pages branch. (All previous history on the gh-pages branch will be lost.)
git push --force "https://yukihop@github.com/yukihop/stage-check.git" master:gh-pages

# we can remove the .git directory at this point.
