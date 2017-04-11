'use strict';

function socketlogger (loggingEvent) {
    loggingEvent.data.push({socketId: this.id, userId: this.synuser.id || 'anonymous'});
    bslogger[loggingEvent.level.levelStr.toLowerCase()](loggingEvent.startTime, loggingEvent.categoryName, ...loggingEvent.data);
    console.info("socketLogger", bslogger.constructor.prototype);
}

export default socketlogger;
