/***  Custom errors
      =============

***/

/*
  ERRORS
*/

[
  {
    Unauthorized: 'You must be signed in'
  }
]

/*
  LOOP
*/

.forEach(function (custom) {
  var key = Object.keys(custom)[0];

  exports[key] = function () {
    var error     = new Error(this.value);
    error.name    = "Synapp_" + this.key + "Error";
    error.message = this.value;
    return error;
  }.bind({ key: key, value: custom[key] });
});
