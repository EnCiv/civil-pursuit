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

  var Nav       =   require('./Nav');
  var Creator   =   require('./Creator');
  var Item      =   require('./Item');
  var Sign      =   require('./Sign');

  /**
   *  @class
   *
   *  @arg {String} type
   *  @arg {ObjectID?} parent
   *  @arg {Number} size
   *  @arg {Number} skip
   */

  function Panel (type, parent, size, skip) {

    if ( ! app ) {
      throw new Error('Missing app');
    }

    var panel = this;

    if ( typeof type !== 'string' ) {
      throw new TypeError('Missing Panel Type string');
    }

    this.type     =   type;
    this.parent   =   parent;
    this.skip     =   skip || 0;
    this.size     =   size || synapp['navigator batch size'];

    this.id       =   'panel-' + this.type;

    if ( this.parent ) {
      this.id += '-' + this.parent;
    }
  }

  /**
   *  @method       Panel.getId
   *  @return       {String} panelId
  */

  Panel.prototype.getId = function () {
    var id = 'panel-' + this.type;

    if ( this.parent ) {
      id += '-' + this.parent;
    }

    return id;
  };

  Panel.prototype.load = require('./Panel/load');

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
    if ( synapp.user ) {
      Nav.toggle(this.find('creator'), this.template, app.domain.intercept());
    }
    else {
      Sign.dialog.join();
    }
  };

  Panel.prototype.render = function (cb) {

    var panel = this;

    this.find('title').text(this.type);

    this.find('toggle creator').on('click', function () {
      panel.toggleCreator($(this));
    });

    panel.template.attr('id', panel.getId());

    var creator = new Creator(panel);

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
  };

  Panel.prototype.toJSON = function () {
    var json = {
      type: this.type,
      size: this.size,
      skip: this.skip
    };

    if ( this.parent ) {
      json.parent = this.parent;
    }

    return json;
  };

  /**
   *  @method fill
   *  @arg {function} cb
   **/

  Panel.prototype.fill            =   require('./Panel/fill');

  Panel.prototype.preInsertItem   =   require('./Panel/pre-insert-item');

  Panel.prototype.insertItem = function (items, i, cb) {

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
