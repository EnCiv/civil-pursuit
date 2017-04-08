"use strict";


// on the broswer, console.info display objects in a way that is compact and lets you expand them and dig down.
// so this default layout will preserve the objects and pass them to console.log
function bconsoleAppender (layout, timezoneOffset) {
  layout = layout || function(e,t){var date=e.startTime.split(' '); return [date[3]+date[1]+date[2]+' '+date[4], e.categoryName, ...e.data]}
  return function(loggingEvent) {
    console.log(...layout(loggingEvent, timezoneOffset));
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
