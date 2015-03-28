! function () {
  
  'use strict';

  var Synapp    =   require('../Synapp');
  var Sign      =   require('../Sign');
  var Intro     =   require('../Intro');
  var Panel     =   require('../Panel');

  window.app = new Synapp();

  app.ready(function onceAppConnects_HomePage () {

    new Sign().render();
    new Intro().render();

    var panel = new Panel('Topic');

    panel
      
      .load(app.domain.intercept(function onGotPanels (template) {

        $('.panels').append(template);

        setTimeout(function renderPanel_Pause () {
          panel.render(app.domain.intercept(function () {
            panel.fill(app.location.item);
          }));
        }, 700);

      }));
  
  });

} ();
