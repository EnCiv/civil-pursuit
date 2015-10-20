#!/usr/bin/env bash

echo 'Run this file calling `vagrant provision`';

# Installing latest node repo
curl -sL https://deb.nodesource.com/setup | sudo bash -

sudo apt-get update || exit 1;

# Install dependencies
sudo apt-get install -y \
  mongodb-server \
  nodejs \
  build-essential || exit 2;

# Repo
cd /synaccord
npm install
