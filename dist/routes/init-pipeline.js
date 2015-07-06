'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _domain = require('domain');

function initPipeLine(req, res, next) {

  try {
    req.user = req.cookies.synuser;

    if (typeof req.user === 'string') {
      req.user = JSON.parse(req.user);
    }

    this.emit('request', req);

    // Forcing item
    require('syn/models/item');

    next();
  } catch (error) {
    next(error);
  }
}

exports['default'] = initPipeLine;
module.exports = exports['default'];