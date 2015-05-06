#!/bin/bash

# This is an example file where to store the configuration variables for app Synaccord
# Copy this file (for example, as "export.sh") and fill it with the needed value
# Then call it like this from terminal ". export.sh"
# Make sure git ignores the file you created.

# Mongo DB URL
export MONGOHQ_URL="mongodb://....";

# HTTP Port (OPTIONAL)
export PORT="Port number (default: 3000)";

# App instance
export SYNAPP_ENV="the name of the instance";

# Selenium Test target
export SYNAPP_SELENIUM_TARGET="http://...";
