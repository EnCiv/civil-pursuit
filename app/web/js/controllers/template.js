; ! function () {

  'use strict';

  module.exports = function template (template) {
    console.info('[template]', template.name, template,
      { cache: template.name in this.model('templates') });

    if ( template.name in this.model('templates') ) {

      if ( typeof template.ready === 'function' ) {
        if ( Array.isArray(this.model('templates')[template.name]) ) {
          this.model('templates')[template.name].push(
            function (view) {
              template.container.append(view);
            },
            template.ready);
        }

        else if ( typeof this.model('templates')[template.name] === 'string' ) {
          template.container.append($(this.model('templates')[template.name]));
          template.ready($(this.model('templates')[template.name]));
        }
      }
    }
    else {
      this.model('templates')[template.name] = [];

      $.ajax(template.url)
        .success(function (data) {

          var toDOM = $(data);
          
          template.container.append(toDOM);

          if ( Array.isArray(this.model('templates')[template.name]) ) {
            this.model('templates')[template.name].forEach(function (queue) {
              queue(toDOM);
            });
          }
          
          this.model('templates')[template.name] = data;

          if ( typeof template.ready === 'function' ) {
            template.ready(toDOM);
          }

        }.bind(this));
    }
  };

} ();
