#!/usr/bin/env bash
#
set -e

if [[ -z "$1" ]]; then
	echo "The release type (major, minor, patch...) is missing."
	exit 1
fi

npm run lint-no-fix
npm run test
npm run build
NEW_VERSION=`npm version $1 | cut -d ' ' -f1 | head -1`

cd dist/
npm publish
cd ..

git push "git@github.com:dinoboff/rx-firebase.git" master "$NEW_VERSION"
