! function () {
  
  'use strict';

  var Synapp = require('../Synapp');
  var Sign = require('../Sign');
  var Panel = require('../Panel');

  window.app = new Synapp();

  app.connect(function () {
    new Sign().render();

    var panel = new Panel('Persona');

    panel
      
      .get(app.domain.intercept(function (template) {

        $('.panels').append(template);

        setTimeout(function () {
          panel.render(app.domain.intercept(function () {
            panel.fill();
          }));
        }, 700);
      }));
  });

} ();
