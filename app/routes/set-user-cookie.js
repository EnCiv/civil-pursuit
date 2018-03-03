'use strict';

import config from '../../secret.json';

function setCookieUser (req, res, next) {
  var cookie={email: req.user.email, id: req.user._id};
  if(!cookie.email && req.tempid) cookie.tempid=req.tempid;  // the temp id is passed in the user object but wasn't saved in the db
  res.cookie('synuser',
    cookie,
    config.cookie);

  next();
}

export default setCookieUser;
