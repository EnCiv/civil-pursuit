! function () {
  
  'use strict';

  var Synapp    =   require('../Synapp');
  var Sign      =   require('../Sign');
  var Intro     =   require('../Intro');
  var Panel     =   require('../Panel');

  window.app = new Synapp();

  app.connect(function () {
    new Sign().render();
    new Intro().render();

    var panel = new Panel('Topic');

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
