! function () {
  
  'use strict';

  module.exports = render;

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Dependencies
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  var Promise             =   require('promise');

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Providers
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  var __Domain            =   require('syn/js/providers/Domain');

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Components
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  var _Creator            =   require('syn/js/components/Creator');
  
  /**
   *
  */

  function render (cb) {
    var panel = this;

    var q = new Promise(function (fulfill, reject) {

      new __Domain(function (d) {

        // Fill title

        panel.find('title').text(panel.type.name);

        // Toggle Creator

        panel.find('toggle creator').on('click', function () {
          panel.toggleCreator($(panel));
        });

        // Panel ID

        panel.template.attr('id', panel.getId());

        console.info('Calling creator');

        var creator = new (require('syn/js/components/Creator'))(panel);

        console.info('Rendering creator');

        creator
          .render()
          .then(fulfill, d.intercept.bind(d));

        console.log('Creator rendered')

        panel.find('load more').on('click', function () {
          panel.fill();
          return false;
        });

        panel.find('create new').on('click', function () {
          panel.find('toggle creator').click();
          return false;
        });

        // Done

        fulfill();

      }, reject);

    });

    if ( typeof cb === 'function' ) {
      q.then(cb.bind(null, null), cb);
    }

    return q;
  }

} ();
