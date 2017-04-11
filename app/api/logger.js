'use strict';

function logger () {
    console.log("s=", this.id, "u=", this.synuser.id || 'anonymous', ...arguments);
}

export default logger;
