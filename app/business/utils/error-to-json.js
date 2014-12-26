! function () {

  'use strict';

  module.exports = function (error) {
    return {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack.split(/\n/)
    };
  };

} ();
