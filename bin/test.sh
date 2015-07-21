#!/usr/bin/bash

# Lib

echo
echo
echo
echo
echo
echo '###########################################'
echo '#   TEST LIB                              #'
echo '###########################################'
echo
echo
echo
echo
echo

node dist/bin/test-lib || exit 1;

# Models

echo
echo
echo
echo
echo
echo '###########################################'
echo '#   TEST MODELS                           #'
echo '###########################################'
echo
echo
echo
echo
echo

node dist/bin/test-models || exit 1;

# API

echo
echo
echo
echo
echo
echo '###########################################'
echo '#   TEST API                              #'
echo '###########################################'
echo
echo
echo
echo
echo

node dist/bin/test-api || exit 1;

# Routes

echo
echo
echo
echo
echo
echo '###########################################'
echo '#   TEST ROUTES                           #'
echo '###########################################'
echo
echo
echo
echo
echo

node dist/bin/test-routes || exit 1;

# Browser / Error

echo
echo
echo
echo
echo
echo '###########################################'
echo '#   TEST BROWSER/ERROR                    #'
echo '###########################################'
echo
echo
echo
echo
echo

node dist/bin/test-browser test/web/pages/error viewport=tablet vendor=firefox env=production || exit 1;

# Browswer / Synchronous error

echo
echo
echo
echo
echo
echo '###########################################'
echo '#   TEST BROWSER/SYNCHRONOUS ERROR        #'
echo '###########################################'
echo
echo
echo
echo
echo

node dist/bin/test-browser test/web/pages/synchronous-error viewport=tablet vendor=firefox env=production || exit 1;

# Browswer / Asynchronous error

echo
echo
echo
echo
echo
echo '###########################################'
echo '#   TEST BROWSER/ASYNCHRONOUS ERROR       #'
echo '###########################################'
echo
echo
echo
echo
echo

node dist/bin/test-browser test/web/pages/asynchronous-error viewport=tablet vendor=firefox env=production || exit 1;

# Browser / Page not found

echo
echo
echo
echo
echo
echo '###########################################'
echo '#   TEST BROWSER/PAGE NOT FOUND           #'
echo '###########################################'
echo
echo
echo
echo
echo

node dist/bin/test-browser test/web/pages/not-found viewport=tablet vendor=firefox env=production || exit 1;

# Browser / Terms of service

echo
echo
echo
echo
echo
echo '###########################################'
echo '#   TEST BROWSER/TERMS OF SERVICE         #'
echo '###########################################'
echo
echo
echo
echo
echo

node dist/bin/test-browser test/web/pages/terms-of-service viewport=tablet vendor=firefox env=production || exit 1;

# Browser / Home

echo
echo
echo
echo
echo
echo '###########################################'
echo '#   TEST BROWSER/HOME                     #'
echo '###########################################'
echo
echo
echo
echo
echo

node dist/bin/test-browser test/web/pages/home viewport=tablet vendor=firefox env=production || exit 1;

# Browser / Item Page not found

echo
echo
echo
echo
echo
echo '###########################################'
echo '#   TEST BROWSER/ITEM NOT FOUND           #'
echo '###########################################'
echo
echo
echo
echo
echo

node dist/bin/test-browser test/web/pages/item-not-found viewport=tablet vendor=firefox env=production || exit 1;

# Browser / Item Page

echo
echo
echo
echo
echo
echo '###########################################'
echo '#   TEST BROWSER/ITEM PAGE                #'
echo '###########################################'
echo
echo
echo
echo
echo

node dist/bin/test-browser test/web/pages/item-page viewport=tablet vendor=firefox env=production
