#!/bin/bash

# Set NPM_PROJECT so that dependency build.sh scripts (e.g. civil-server) that
# check this variable will skip their own packbuild step when installed here.
export NPM_PROJECT=civil-pursuit

# These directoies need to exist in dist, even if you don't have them in your project

mkdir -p dist/events
mkdir -p dist/routes
mkdir -p dist/socket-apis
mkdir -p dist/web-components
#
# assets is where static files go
#
mkdir -p ./assets/js/
# socket.io-streams requires a static load of this file, so we put it in assets
cp ./node_modules/socket.io-stream/socket.io-stream.js ./assets/js/
# you can start with the favicon images from civil-server - but you may want to replace them with your own some day
mkdir -p ./assets/images
cp -r node_modules/civil-server/assets/images ./assets

# so the styles can work on server side render
jss convert node_modules/react-perfect-scrollbar/dist/css/styles.css -f js -e cjs > node_modules/react-perfect-scrollbar/dist/css/styles.js

npm run svgr || {
  echo Could not svgr
  exit 1
}

#
# Update/create web-components/index.js to require all react components in that director, and in the listed child/peer directories. Web components are used by the getIota route - which uses reactServerRender
# Include app/web-components again at the end if you want it's components to have priority over previous directories in the list
#
if command -v react-directory-indexer &>/dev/null || [ -f ./node_modules/.bin/react-directory-indexer ]; then
  ./node_modules/.bin/react-directory-indexer app/web-components/ node_modules/civil-server/dist/web-components/ app/web-components || {
    echo Could not build web-components
    exit 1
  }
  #
  # Update/create data-components/index.js to require all data-components in that director, and in the listed child/peer directories. Data components are used by the getIota route.
  #
  ./node_modules/.bin/react-directory-indexer --data app/data-components/ node_modules/civil-server/dist/data-components/ || {
    echo Could not build data-components
    exit 1
  }
else
  echo "react-directory-indexer not found (civil-server not yet installed) - skipping web-components and data-components index generation"
fi

npm run transpile  || {
  echo Could not transpile;
  exit 1
}
echo "transpile ok"

# don't run webpack if this is a dependency of another project - the memory usage will blow out heroku build 
# also skip if civil-server is not yet installed (can happen on first npm install before peer deps are resolved)
if [[ ( "$NPM_PROJECT" = "" || "$NPM_PROJECT" == "civil-pursuit" ) && -f node_modules/civil-server/package.json ]]; then {
  npm run packbuild  || {
    echo Could not webpack;
    exit 1
  }
}; fi



