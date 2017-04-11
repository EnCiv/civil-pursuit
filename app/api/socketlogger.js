'use strict';

function socketlogger (loggingEvent) {
    loggingEvent.data.push({socketId: this.id, userId: this.synuser.id || 'anonymous'});
    logger.info(loggingEvent);
    console.info("socketLogger", Object.keys(logger));
}

export default socketlogger;
