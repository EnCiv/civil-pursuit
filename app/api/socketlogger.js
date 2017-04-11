'use strict';

function socketlogger (loggingEvent) {
    loggingEvent.data.push({socketId: this.id, userId: this.synuser.id || 'anonymous'});
    bslogger.emit('log',loggingEvent);
//    bslogger[loggingEvent.level.levelStr.toLowerCase()](loggingEvent.startTime, ...loggingEvent.data);
}

export default socketlogger;
