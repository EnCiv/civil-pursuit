'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function setParty(userId, partyId) {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      _this.findById(userId).exec().then(function (user) {
        try {
          if (!user) {
            throw new Error('No such user ' + userId);
          }
          user.party = partyId;
          user.save(function (error) {
            if (error) {
              ko(error);
            } else {
              ok(user);
            }
          });
        } catch (error) {}
      }, ko);
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = setParty;
module.exports = exports['default'];