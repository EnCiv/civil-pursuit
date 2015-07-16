#!/usr/bin/bash

watchify dist/pages/home/ctrl.js -o dist/pages/home/bundle.js &

watchify dist/pages/profile/ctrl.js -o dist/pages/profile/bundle.js &

watchify dist/pages/not-found/ctrl.js -o dist/pages/not-found/bundle.js &

watchify dist/pages/terms-of-service/ctrl.js -o dist/pages/terms-of-service/bundle.js &

watchify dist/pages/error/ctrl.js -o dist/pages/error/bundle.js &

watchify dist/pages/item/ctrl.js -o dist/pages/item/bundle.js
