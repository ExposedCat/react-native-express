#!/bin/bash

echo "Bundling react native..."
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/res/index.android.bundle --assets-dest android/app/src/main/res

pushd android

echo "Building APK..."
./gradlew assembleRelease

popd