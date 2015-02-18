/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  P   R   O   M   O   T   E

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function () {

  'use strict';

  var Item      =   require('./Item');
  var Nav       =   require('./Nav');
  var Edit      =   require('./Edit');

  /**
   *  @class Promote
   *  @arg {Item} item
   */

  function Promote (item) {
    if ( ! app ) {
      throw new Error('Missing app');
    }

    var self = this;

    app.domain.run(function () {
      if ( ! item || ( ! item instanceof require('./Item') ) ) {
        throw new Error('Item must be an Item');
      }

      self.item = item;

      self.template = item.find('promote');

      if ( ! self.template.length ) {
        throw new Error('Template not found');
      }

      self.watch = new (require('events').EventEmitter)();

      self.$bind('limit', self.renderLimit.bind(self));

      self.$bind('cursor', self.renderCursor.bind(self));

      self.$bind('left', self.renderLeft.bind(self));

      self.$bind('right', self.renderRight.bind(self));
    });
      
  }

  /**
   *  @method renderLimit
   */

  Promote.prototype.renderLimit = function () {
    this.find('limit').text(this.evaluation.limit);
  };

  /**
   *
   */

  Promote.prototype.renderCursor = function () {
    this.find('cursor').text(this.evaluation.cursor);
  };

  /**
   *
   */

  Promote.prototype.renderLeft = function () {
    this.renderItem('left');
  };

  /**
   *
   */

  Promote.prototype.edit = function (key, value) {
    this.evaluation[key] = value;

    this.watch.emit(key);
  };

  /**
   *
   */

  Promote.prototype.$bind = function (key, binder) {
    this.watch.on(key, binder);
  };

  /**
   *
   */

  /**
   *
   */

  Promote.prototype.renderRight = function () {
    this.renderItem('right');
  };

  /**
   *  @description Selector aliases getter
   */

  Promote.prototype.find            =     require('./Promote/find');

  /**
   *  @description render one of the sides in a side by side
   */

  Promote.prototype.renderItem      =     require('./Promote/render-item');

  /**
   *  @description
   */

  Promote.prototype.render          =     require('./Promote/render');

  /**
   *  @description
   */

  Promote.prototype.get             =     require('./Promote/get');

  /**
   *  @description
   */

  Promote.prototype.finish          =     require('./Promote/finish');

  /**
   *  @description
   */

  Promote.prototype.save            =     require('./Promote/save');

  module.exports = Promote;

} ();
