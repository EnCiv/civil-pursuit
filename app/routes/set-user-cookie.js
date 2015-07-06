'use strict';

import config from '../../config.json';

function setCookieUser (req, res, next) {
  res.cookie('synuser',
    { email: req.user.email, id: req.user._id },
    config.cookie);

  next();
}

export default setCookieUser;
