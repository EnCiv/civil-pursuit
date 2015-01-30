; ! function () {

  'use strict';

  module.exports = function template (template) {
    var app = this;

    process.nextTick(function () {
      console.info('[✨]', "\ttemplat\t", template.name, {
        cache: template.name in app.model('templates'),
        template: template
      });

      // If cached

      if ( template.name in app.model('templates') ) {

        // Queue template

        if ( Array.isArray(app.model('templates')[template.name]) ) {
          app.model('templates')[template.name].push(
            function (html) {
              
              var dom = $(html);

              template.container.append(dom);

              if ( typeof template.ready === 'function' ) {
                template.ready(dom);
              }
            });
        }

        // If cache is HTML string

        else if ( typeof app.model('templates')[template.name] === 'string' ) {
          template.container.append($(app.model('templates')[template.name]));
          
          if ( typeof template.ready === 'function' ) {
            template.ready($(app.model('templates')[template.name]));
          }
        }
      }

      // If not cached, AJAX, execute queue and cache

      else {

        // Sets queue

        app.model('templates')[template.name] = [];

        $.ajax(template.url)
          .success(function (data) {

            // Inject to DOM
            var toDOM = $(data);
            
            try {
              template.container.append(toDOM);
            }
            catch ( error ) {
              throw new Error('Template has no container: ' + template.name);
            }

            // Execute queue

            if ( Array.isArray(app.model('templates')[template.name]) ) {
              app.model('templates')[template.name].forEach(function (queue) {
                queue(data);
              });
            }

            // Cache HTML
            
            app.model('templates')[template.name] = data;

            // Execute ready function

            if ( typeof template.ready === 'function' ) {
              template.ready(toDOM);
            }

          });
      }
    });
  };

} ();
