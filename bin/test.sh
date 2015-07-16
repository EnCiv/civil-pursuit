#!/usr/bin/bash

# Lib

node dist/bin/test-lib &&

# Models

node dist/bin/test-models &&

# API

node dist/bin/test-api &&

# Routes

node dist/bin/test-routes &&

# Browser / Error

node dist/bin/test-browser test/web/pages/error viewport=tablet vendor=firefox &&

# Browswer / Synchronous error

node dist/bin/test-browser test/web/pages/synchronous-error viewport=tablet vendor=firefox &&

# Browswer / Asynchronous error

node dist/bin/test-browser test/web/pages/asynchronous-error viewport=tablet vendor=firefox &&

# Browser / Page not found

node dist/bin/test-browser test/web/pages/not-found viewport=tablet vendor=firefox &&

# Browser / Terms of service

node dist/bin/test-browser test/web/pages/terms-of-service viewport=tablet vendor=firefox &&

# Browser / Home

node dist/bin/test-browser test/web/pages/home viewport=tablet vendor=firefox &&

# Browser / Item Page

node dist/bin/test-browser test/web/pages/item-page viewport=tablet vendor=firefox
