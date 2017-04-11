'use strict';

function socketlogger (loggingEvent) {
    loggingEvent.data.push({socketId: this.id, userId: this.synuser.id || 'anonymous'});
    logger[loggingEvent.level.levelStr.toLowerCase()](loggingEvent.startTime, loggingEvent.categoryName, ...loggingEvent.data);
    console.info("socketLogger", logger);
}

export default socketlogger;
