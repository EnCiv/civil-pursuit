! function () {
  
  'use strict';

  // var Creator = require('../Creator');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function render (cb) {
    var panel = this;

    this.find('title').text(this.type);

    this.find('toggle creator').on('click', function () {
      panel.toggleCreator($(this));
    });

    panel.template.attr('id', panel.getId());

    var creator = new (require('../Creator'))(panel);

    creator.render(app.domain.intercept(function () {
      cb();     
    }));

    this.find('load more').on('click', function () {
      panel.fill();
      return false;
    });

    this.find('create new').on('click', function () {
      panel.find('toggle creator').click();
      return false;
    });

    return this;
  }

  module.exports = render;

} ();
