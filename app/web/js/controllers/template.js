; ! function () {

  'use strict';

  module.exports = function template (template) {
    if ( this.model('templates')[template] ) {
      //template.container.append($(this.model('templates')[template]));
    }
    else {
      $.ajax(template.url)
        .success(function (data) {

          var toDOM = $(data);
          
          template.container.append(toDOM);
          
          this.model('templates')[template] = data;

          if ( typeof template.ready === 'function' ) {
            template.ready(toDOM);
          }

        }.bind(this));
    }
  };

} ();
