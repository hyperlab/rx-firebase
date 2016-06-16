#!/usr/bin/env bash
#
# !!! Assumed to be run via a npm run command !!!
# 
set -e

DIST=dist/
OUTPUT=${DIST}/rx-firebase.js
OUTPUT_MIN=${DIST}/rx-firebase.min.js

# Clean up
rm -rf "$DIST"
mkdir -p "$DIST"

# Copy assets
cp LICENSE README.md tools/assets/dist/* "$DIST"

# Transcode and bundle tests in a format nodejs can load.
jspm build rx-firebase "$OUTPUT" \
	--format umd --global-name rxFirebase \
	--skip-source-maps
jspm build rx-firebase "$OUTPUT_MIN" \
	--format umd --global-name rxFirebase \
	--skip-source-maps --minify