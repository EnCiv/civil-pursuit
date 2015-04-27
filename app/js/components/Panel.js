/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  PANEL

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function () {

  'use strict';

  /** Providers */

  var Nav       =   require('syn/js/providers/Nav');
  var Session   =   require('syn/js/providers/Session');

  /** Components */

  var Creator   =   require('syn/js/components/Creator');
  var Item      =   require('syn/js/components/Item');
  var Sign      =   require('syn/js/components/Sign');

  /**
   *  @class
   *
   *  @arg {Object} type
   *  @arg {ObjectID?} parent
   *  @arg {Number} size
   *  @arg {Number} skip
   */

  function Panel (type, parent, size, skip) {

    if ( ! app ) {
      throw new Error('Missing app');
    }

    var panel = this;

    this.type     =   type;
    this.parent   =   parent;
    this.skip     =   skip || 0;
    this.size     =   size || synapp['navigator batch size'];

    this.id       =   'panel-' + this.type._id;

    if ( this.parent ) {
      this.id += '-' + this.parent;
    }
  }

  /**
   *  @method       Panel.getId
   *  @return       {String} panelId
  */

  Panel.prototype.getId = function () {
    return this.id;
  };

  Panel.prototype.load = require('syn/js/components/Panel/load');

  Panel.prototype.find = function (name) {
    switch ( name ) {
      case 'title':
        return this.template.find('.panel-title:first');

      case 'toggle creator':
        return this.template.find('.toggle-creator:first');

      case 'creator':
        return this.template.find('.creator:first');

      case 'items':
        return this.template.find('.items:first');

      case 'load more':
        return this.template.find('.load-more:first');

      case 'create new':
        return this.template.find('.create-new:first');
    }
  };

  Panel.prototype.toggleCreator = function (target) {

    console.info('is in', Session.isIn());
    
    if ( Session.isIn() ) {
      Nav.toggle(this.find('creator'), this.template, app.domain.intercept());
    }
    else {
      Sign.dialog.join();
    }
  };

  Panel.prototype.render          =   require('syn/js/components/Panel/render');

  Panel.prototype.toJSON          =   require('syn/js/components/Panel/to-json');

  Panel.prototype.fill            =   require('syn/js/components/Panel/fill');

  Panel.prototype.preInsertItem   =   require('syn/js/components/Panel/pre-insert-item');

  Panel.prototype.insertItem      =   function (items, i, cb) {

    var self = this;

    if ( items[i] ) {

      var item  = new Item(items[i]);

      console.log('inserting item ', i, item)

      item.load(app.domain.intercept(function (template) {
        self.find('items').append(template);

        item.render(app.domain.intercept(function () {
          self.insertItem(items, ++ i, cb);
        }));

      }));
    }
    else {
      cb && cb();
    }
    
  };

  module.exports = Panel;

} ();
