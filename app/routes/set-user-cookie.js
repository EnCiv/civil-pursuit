'use strict';

import config from '../../secret.json';

function setCookieUser (req, res, next) {
  var cookie;
  if(req.user) {
    cookie={email: req.user.email, id: req.user._id, tempid: req.tempid}  // the temp id is passed in the req from the temp-id route
  }else if(req.cookies.synuser){
    cookie=Object.assign(req.cookies.synuser)  // just copy the old user info so we can extend the maxAge
  }
  if(cookie)
    res.cookie('synuser',
      cookie,
      config.cookie);
  else
    res.clearCookie('synuser');
  next();
}

export default setCookieUser;
