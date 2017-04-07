"use strict";
var layouts = require('log4js').layouts;

function bconsoleAppender (layout, timezoneOffset) {
  console.info("bconsoleAppender",layout, timezoneOffset);
  //layout = layout || layouts.messagePassThroughLayout;
  return function(loggingEvent) {
    console.info(loggingEvent);
  };
}

function configure(config) {
  console.info("bconsole.configure")
  var layout;
  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
  }
  return bconsoleAppender(layout, config.timezoneOffset);
}

exports.appender = bconsoleAppender;
exports.configure = configure;
