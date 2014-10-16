/***  Custom errors
      =============

***/

/*
  ERRORS
*/

var Errors = {
  Unauthorized      :   'You must be signed in',
  DuplicateUser     :   'This account is already in use'
};

for ( var key in Errors ) {
  exports[key] = function () {
    var error     = new Error(this.value);
    error.name    = "Synapp_" + this.key + "Error";
    error.message = this.value;
    return error;
  }.bind({ key: key, value: Errors[key] });
}
