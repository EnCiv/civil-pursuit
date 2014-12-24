; ! function () {

  'use strict';

  module.exports = function template (template) {
    var app = this;

    process.nextTick(function () {
      console.info('[template]', template.name, template,
        { cache: template.name in app.model('templates') });

      if ( template.name in app.model('templates') ) {

        if ( typeof template.ready === 'function' ) {
          if ( Array.isArray(app.model('templates')[template.name]) ) {
            app.model('templates')[template.name].push(
              function (view) {
                template.container.append(view);
              },
              template.ready);
          }

          else if ( typeof app.model('templates')[template.name] === 'string' ) {
            template.container.append($(app.model('templates')[template.name]));
            template.ready($(app.model('templates')[template.name]));
          }
        }
      }
      else {
        app.model('templates')[template.name] = [];

        $.ajax(template.url)
          .success(function (data) {

            var toDOM = $(data);
            
            try {
              template.container.append(toDOM);
            }
            catch ( error ) {
              throw new Error('Template has no container: ' + template.name);
            }

            if ( Array.isArray(app.model('templates')[template.name]) ) {
              app.model('templates')[template.name].forEach(function (queue) {
                queue(toDOM);
              });
            }
            
            app.model('templates')[template.name] = data;

            if ( typeof template.ready === 'function' ) {
              template.ready(toDOM);
            }

          });
      }
    });
  };

} ();
