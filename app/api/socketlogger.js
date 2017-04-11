'use strict';

function socketlogger (loggingEvent) {
    loggingEvent.data.push({socketId: this.id, userId: this.synuser.id || 'anonymous'});
    logger[loggingEvent.level](loggingEvent);
}

export default socketlogger;
