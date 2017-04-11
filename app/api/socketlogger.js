'use strict';

function socketlogger (loggingEvent) {
    loggingEvent.data.push({socketId: this.id, userId: this.synuser.id || 'anonymous'});
//    bslogger[loggingEvent.level.levelStr.toLowerCase()](loggingEvent.startTime, ...loggingEvent.data);
    bslogger.log(loggingEvent);
}

export default socketlogger;
