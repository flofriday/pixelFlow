#!/bin/bash

# I am using an ubunutu server to package and build pixelFlow.
# The reason for this is because windows can't build macOS packages. On Ubuntu
# it works just fine so I am using this now. (Hate Windows so much)

# This file just builds pixelFlow. NOT DOWNLOADING!


# Compile the electron app
cd pixelFlow/App
npm install
npm run build:all

# Move the build folder
cd ../../
mv pixelFlow/App/build/ ./
cd build

# Zip all files
echo Zip the builds \(can take a while\) ...
for i in */; do zip -r -9 "${i%/}.zip" "$i"; done >> /dev/null
