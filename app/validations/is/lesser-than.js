! function () {
  
  'use strict';

  function Validations__isLesserThan (max) {
    return function (value) {

      return value.length < max;

    };
  }

  module.exports = Validations__isLesserThan;

} ();
