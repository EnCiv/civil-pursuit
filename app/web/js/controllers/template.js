; ! function () {

  'use strict';

  module.exports = function template (template) {
    if ( this.model('templates')[template] ) {
      //template.container.append($(this.model('templates')[template]));
    }
    else {
      $.ajax(template.url)
        .success(function (data) {
          template.container.append($(data));
          this.model('templates')[template] = data;
        }.bind(this));
    }
  };

} ();
