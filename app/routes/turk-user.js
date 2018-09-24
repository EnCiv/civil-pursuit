'use static';
import User from '../models/user';
import State from '../models/state';
import MechanicalTurk from '../lib/mechanical-turk';

var States;

function getUserProfile(hitId){
    return new Promise((ok,ko)=>{
        try{
            MechanicalTurk.getUserProfileForHITId(hitId).then(
                profile=>{
                    let matched;
                    profile.state && States.some(s=>{  // state needs to be an _id not a name
                        if(profile.state===s.name) {profile.state=s._id; matched=true; return true}
                    });
                    if(!matched) console.error("turk-user: state not matched", profile );
                    ok(profile);
                },
                (err)=>ko("turk-user getUserProfile error from MechanicalTurk: " + err)
            )
        }
        catch(error){
            console.error("getIserProfile", error);
            throw(error);
        }
    })
}

export default function turkUser(req, res, next){
    if(States) return doTurkUser(req,res,next);
    else {
        State.find().limit(false)
        .then(states=>{
            States=states.map(s=>s.toJSON());
            return doTurkUser(req,res,next);
        })
        .catch((err)=>next("turk-user couldn't initialize States: "+err));
    }
}


function doTurkUser(req,res,next){
    try {
        let userId = (req.cookies.synuser && req.cookies.synuser.id) ? req.cookies.synuser.id : null;
        let turkAssignmentId=req.cookies.turk && req.cookies.turk.assignmentId;
        var assignmentId = req.query.assignmentId;  // {...} doesn't work with req.query
        var hitId = req.query.hitId;
        var workerId = req.query.workerId;
        var turkSubmitTo = req.query.turkSubmitTo;
        if (userId && !turkAssignmentId && !assignmentId) return next(); // nothing to do here, the user is already logged in -- if there's an assignment Id, need to proceed incase uses is working on a new assignment
        if(assignmentId==="ASSIGNMENT_ID_NOT_AVAILABLE") return next('route');
        if (!(assignmentId && hitId && workerId && turkSubmitTo)) return next(); // nothing to do here
        if (assignmentId === turkAssignmentId) return next(); // user already logged in, there is an assignment and it's the one being worked on, so nothing to do here
        req.MechanicalTurkTask={assignmentId, turkSubmitTo, hitId};
        User.findOne({ workerId }).then(user => {
            if (!user) {
                getUserProfile(hitId).then(profile=>{
                    if(profile==={}) return next("turkUser workedId but no profile / Hit valid?: "+hitId);
                    let password = ''; // generate a random password
                    let length = Math.floor(Math.random() * 9) + 16; // the length will be between 16 and 24 characters
                    for (; length > 0; length--) {
                        password += String.fromCharCode(65 + Math.floor(Math.random() * 26)); // any character between A and Z
                    }
                    User
                        .insertOne({ workerId, password, ...profile, turks: [{ hitId, assignmentId, turkSubmitTo }] })
                        .then(
                            user => { 
                                if (user) {
                                    req.user = user.toJSON();
                                    req.user.assignmentId=assignmentId;
                                    return next();
                                } else 
                                    return next(new Error("Error: turkUser Empty"));
                            }, 
                            error => next('turkUser insertOne error:' + error)
                        )
                },
                err=>next(err)
                )
            } else {
                user = user.toJSON(); // convert to a regular object from a Mungo object
                req.user = user; // user wasn't already logged in so we need this for setting the cookie
                req.user.assignmentId=assignmentId;  // user is working on this assignment
                if (user.turks.some(t => t.assignmentId === assignmentId)) return next(); // this assignment is already in progress
                user.turks=user.turks.concat([{ hitId, assignmentId, turkSubmitTo }]); // make a clean copy so not to upset mungo
                User.update({ _id: user._id }, {$set: {turks: user.turks}}) // don't write the whole doc, just the table so make it easier on mungo
                    .then(next, (error) => next('turkUser update Error:' + error))
            }
        }, (error) => next('turkUser FindOne Error: ' + error));
    }
    catch(error){
        console.error("do_turk_user error:", error);
        throw(error);
    }
}