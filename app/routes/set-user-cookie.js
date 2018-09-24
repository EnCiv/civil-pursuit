'use strict';

import config from '../../secret.json';

function setCookieUser (req, res, next) {
  var cookie;
  var turkCookie;
  if(req.MechanicalTurkTask){
    turkCookie=Object.assign(req.MechanicalTurkTask);
    res.cookie('turk', turkCookie, Object.assign({},config.cookie,{"maxAge": 1000*60*60*24*3})); // override max age to be 1 day)
  } // don't extend the age of the cookie ..  else if (req.cookies.turk) {
    
  if(req.user) {
    cookie={email: req.user.email, id: req.user._id, tempid: req.tempid}  // the temp id is passed in the req from the temp-id route
    if(req.user.assignmentId) cookie.assignmentId=req.user.assignmentId;
  }else if(req.cookies.synuser){
    cookie=Object.assign(req.cookies.synuser)  // just copy the old user info so we can extend the maxAge
  }
  if(cookie)
    res.cookie('synuser', cookie, config.cookie);
  else {
    res.clearCookie('synuser');
    res.clearCookie('turk');
  }
  next();
}

export default setCookieUser;
