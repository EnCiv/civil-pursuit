! function () {
  
  'use strict';

  module.exports          =   render;

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Dependencies
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  var Promise             =   require('promise');

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Providers
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  var domainRun     =   require('syn/lib/util/domain-run');
  
  /** PanelComponent.Render
   *
   *  @method             PanelComponent.render
   *  @arg                {Function}
  */

  function render (cb) {
    var panel = this;

    var q = new Promise(function (fulfill, reject) {

      domainRun(function (d) {

        // Fill title                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        panel.find('title').text(panel.type.name);

        // Toggle Creator

        panel.find('toggle creator').on('click', function () {
          panel.toggleCreator($(panel));
        });

        // Panel ID

        if ( ! panel.template.attr('id') ) {
          panel.template.attr('id', panel.getId());
        }

        var creator = new (require('syn/components/Creator/Controller'))(panel);

        creator
          .render()
          .then(fulfill, d.intercept.bind(d));

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
