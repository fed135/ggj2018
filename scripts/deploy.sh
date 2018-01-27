#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

SOURCE_BRANCH="dev"
TARGET_BRANCH="master"

function doCompile {
	echo "DO COMPILE"
	npm run build
}

# Pull requests and commits to other branches shouldn't try to deploy, just build to verify
echo "$TRAVIS_PULL_REQUEST - $TRAVIS_BRANCH - $SOURCE_BRANCH";
if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "$SOURCE_BRANCH" ]; then
    echo "Skipping deploy; just doing a build."
    doCompile
    exit 0
fi

# Save some useful information
REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
SHA=`git rev-parse --verify HEAD`

# Clone the existing gh-pages for this repo into dist/
# Create a new empty branch if gh-pages doesn't exist yet (should only happen on first deply)
git clone $REPO dist
cd dist
git checkout $TARGET_BRANCH || git checkout --orphan $TARGET_BRANCH
cd ..

# Clean dist existing contents
rm -rf dist/**/* || exit 0

# Run our compile script
echo "========================================================"
echo "Compiling"
doCompile

# Copy our other static content to the dist repo
echo "========================================================"
echo "Copy static assets"
#cp -R assets/* dist
#cp index.html dist/index.html

# Now let's go have some fun with the cloned repo
echo "========================================================"
echo "Git config"
cd dist
git config user.name "Travis CI"
git config user.email "$COMMIT_AUTHOR_EMAIL"

# Remove stuff we dont need for the website
echo "========================================================"
echo "Remove config files"
rm -rf .travis.yml
rm -rf deploy_key
rm -rf webpack.conf.js
rm -rf webpack.local.conf.js
rm -rf yarn.lock

# If there are no changes to the compiled public (e.g. this is a README update) then just bail.
if git diff --quiet; then
    echo "No changes to the output on this push; exiting."
    exit 0
fi

# Commit the "changes", i.e. the new version.
# The delta will show diffs between new and old versions.
git add -A .
git commit -m "Deploy to GitHub Pages: ${SHA}"
echo "Commit done"

# Get the deploy key by using Travis's stored variables to decrypt deploy_key.enc
ENCRYPTED_KEY_VAR="encrypted_${ENCRYPTION_LABEL}_key"
ENCRYPTED_IV_VAR="encrypted_${ENCRYPTION_LABEL}_iv"
ENCRYPTED_KEY=${!ENCRYPTED_KEY_VAR}
ENCRYPTED_IV=${!ENCRYPTED_IV_VAR}
openssl aes-256-cbc -K $encrypted_96214dec6a0b_key -iv $encrypted_96214dec6a0b_iv -in ggj2018_key.enc -dist ggj2018_key -d
chmod 600 ggj2018_key
eval `ssh-agent -s`
ssh-add ggj2018_key

# Now that we're all set up, we can push.
git push $SSH_REPO $TARGET_BRANCH
echo "========================================================"
echo "Push done"
