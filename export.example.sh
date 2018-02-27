#!/bin/bash

# This is an example file where to store the configuration variables for app Synaccord
# Copy this file to export.sh and fill it with the needed value
# Then call it like this from terminal ". export.sh"
# Make sure git ignores the file you created.

#copy databases over - path is for windows
"C:\Program Files\MongoDB\Server\3.4\bin\mongorestore.exe" -h localhost -d synapp ../dump-dir/image-name

# Mongo DB URL
export MONGOHQ_URL="mongodb://localhost:27017/synapp"

# HTTP Port (OPTIONAL) default 3000
export PORT="80";

# App instance name - used to look up things in public.json
export SYNAPP_ENV="alpha";

# Selenium Test target
export SYNAPP_SELENIUM_TARGET="http://...";

# Node environment
export NODE_ENV=production

# CDN service
export CLOUDINARY_URL="cloudinary://642125633197983:Y_ml8LZ8WhvDTCCMtW2roxCRBlg@hcv1vvrxn"


