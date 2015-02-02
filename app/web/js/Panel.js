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

  /**
   *  @class
   *
   *  @arg {String} type
   *  @arg {String?} parent
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

  // require('util').inherits(Panel, require('events').EventEmitter);

  Panel.prototype.getId = function () {
    var id = 'panel-' + this.type;

    if ( this.parent ) {
      id += '-' + this.parent;
    }

    return id;
  };

  Panel.prototype.get = function (cb) {
    var panel = this;

    $.ajax({
      url: '/partial/panel'
    })

      .error(cb)

      .success(function (data) {
        panel.template = $(data);

        cb(null, panel.template);
      });

    return this;
  };

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
    }
  };

  Panel.prototype.toggleCreator = function (target) {
    if ( synapp.user ) {
      Nav.toggle(this.find('creator'), this.template, app.domain.intercept());
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

  Panel.prototype.fill = function (cb) {
    var self = this;

    app.socket.emit('get items', this.toJSON());

    app.socket.once('got items ' + this.id, function (panel, items) {
      
      console.log('got items', panel, items)

      self.skip += items.length;

      self.insertItem(items, 0, cb);
    });
  };

  Panel.prototype.insertItem = function (items, i, cb) {

    var self = this;

    if ( items[i] ) {

      var item  = new Item(items[i]);

      item.get(app.domain.intercept(function (template) {
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
