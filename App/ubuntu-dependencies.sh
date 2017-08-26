#!/bin/bash

# I am using an ubunutu server to package and build pixelFlow.
# The reason for this is because windows can't build macOS packages. On Ubuntu
# it works just fine so I am using this now. (Hate Windows so much)

# This file installs all dependencies we need to build pixelFlow.


# Install node.js
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential

# Install git
sudo apt-get install -y git

# Install python, make and GCC (needed for node-gyp)
sudo apt-get install -y python
sudo apt-get install -y make
sudo apt-get install -y gcc g++

# Install node-gyp
sudo npm install -g node-gyp

# Install wine (for windows binaries)
sudo apt-get install wine
