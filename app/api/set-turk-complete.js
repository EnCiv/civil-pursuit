'use strict';

import randomstring from 'randomstring';
import DB from '../lib/util/db';
import {ObjectID} from 'mongodb';

function setTurkComplete(assignmentId, cb) {
    if (!(this.synuser && this.synuser.id)) {
        console.error("setTurkComplete user not logged in", assignmentId);
        return cb({ error: "Not Logged In" })
    }
    try {
        var comment = randomstring.generate(12);
        DB.db.collection('users').updateOne({ _id: ObjectID(this.synuser.id), "turks.assignmentId": assignmentId }, { $set: { "turks.$.comment": comment } }).then(
            updateWriteOpResult => {
                if(updateWriteOpResult.result.ok)
                {    cb({ comment })
                } else {
                    cb({ error: "couldn't set result" })
                }
            },
            err => cb({ error: "update assignment returned: " + err })
        )
    }
    catch (err) {
        console.error("set-turk-complete caught error: ", err);
        cb({ error: "unknown error: " + err });
    }
}

export default setTurkComplete;
