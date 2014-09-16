module.exports = function () {
  var moment = require('moment');

  return function (date) {
    if ( date && date.constructor.name === 'String' ) {
      return moment(date).format('ddd DD MMM YY HH:mm:ss');
    }

    else if ( date && date.constructor.name === 'Moment' ) {
      return date.format('ddd DD MMM YY HH:mm:ss');
    }
  };
};