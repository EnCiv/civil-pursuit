"use strict";


// on the broswer, console.info display objects in a way that is compact and lets you expand them and dig down.
// so this default layout will preserve the objects and pass them to console.log
function bconsoleAppender (layout, timezoneOffset) {
  layout = layout || function(e,t){
    var d=e.startTime; 
    return [d.getFullYear()+d.toLocaleString({month: 'short'})+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+'.'+d.getMilliseconds(),
     e.categoryName, ...e.data]
  }
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
