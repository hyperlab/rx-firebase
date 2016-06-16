#!/usr/bin/env bash
#
# !!! Assumed to be run via a npm run command !!!
# 
set -e

SRC=rx-firebase/rx-firebase.specs.js
DIST=_test
OUTPUT=${DIST}/test.js
COVERAGE=coverage


rm -rf "$DIST" "$COVERAGE"
mkdir -p "$DIST"

echo "Building tests in $DIST..."
jspm build "$SRC" "$OUTPUT" --skip-rollup --format cjs

echo "Run tests with coverage..."
istanbul cover -v --es-modules --print none --report json _mocha -- "$OUTPUT" 2> /dev/null

echo "Remapping coverage..."
mv "${COVERAGE}/coverage-final.json" "${COVERAGE}/coverage.json"
remap-istanbul -i "${COVERAGE}/coverage.json" -o "${COVERAGE}/coverage.json" -e 'jspm_packages,.specs.js'

echo "Creating coverage report..."
istanbul report --es-modules lcov text
