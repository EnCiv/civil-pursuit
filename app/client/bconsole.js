"use strict";



function bconsoleAppender (layout, timezoneOffset) {
  layout = layout || function(e,t){var data=e.data; return [e.startTime, e.CategoryName, ...data]}

  return function(loggingEvent) {
    console.info(layout(loggingEvent, timezoneOffset));
  };
}

function configure(config) {
  var layout;
  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
  }
  return bconsoleAppender(layout, config.timezoneOffset);
}

exports.appender = bconsoleAppender;
exports.configure = configure;
