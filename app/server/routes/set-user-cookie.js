'use strict';

import Config from '../../../public.json';

// must be called with 'this' of the server
async function setCookieUser (req, res, next) {
  var cookie;
  var turkCookie;
  if(req.MechanicalTurkTask){
    turkCookie=Object.assign(req.MechanicalTurkTask);
    res.cookie('turk', turkCookie, Object.assign({},Config.cookie,{"maxAge": 1000*60*60*24*3})); // override max age to be 1 day)
  } // don't extend the age of the cookie ..  else if (req.cookies.turk) {
    
  if(req.user) {
    cookie={email: req.user.email, id: req.user._id, tempid: req.tempid}  // the temp id is passed in the req from the temp-id route
    if(req.user.assignmentId) cookie.assignmentId=req.user.assignmentId;
    res.cookie('synuser', cookie, Config.cookie);
    next();
  }else if(req.cookies.synuser){
    cookie=Object.assign(req.cookies.synuser)  // just copy the old user info so we can extend the maxAge
    this.socketAPI.validateUserCookie(cookie,
      ()=>{ /// ok
        cookie=Object.assign(req.cookies.synuser)  // just copy the old user info so we can extend the maxAge
        res.cookie('synuser', cookie, Config.cookie);
        next();      
      },
      ()=>{ // ko
        res.clearCookie('synuser');
        res.clearCookie('turk');
        next(new Error(`setUserCookie: user id ${req.cookies.synuser.id} not found in this server/db`));
      }
    )
  } else {
    res.clearCookie('synuser');
    res.clearCookie('turk');
    next();
  }
}

export default setCookieUser;
