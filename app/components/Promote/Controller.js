! function () {

  'use strict';

  var Item      =   require('syn/components/Item/Controller');
  var Nav       =   require('syn/lib/util/Nav');
  var Edit      =   require('syn/components/EditAndGoAgain/Controller');

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
      if ( ! item || ( ! item instanceof require('syn/components/Item/Controller') ) ) {
        throw new Error('Item must be an Item');
      }

      self.item = item;

      self.template = item.find('promote');

      if ( ! self.template.length ) {
        throw new Error('Promote template not found');
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

  Promote.prototype.find            =     require('syn/components/Promote/controllers/find');

  /**
   *  @description render one of the sides in a side by side
   */

  Promote.prototype.renderItem      =     require('syn/components/Promote/controllers/render-item');

  /**
   *  @description
   */

  Promote.prototype.render          =     require('syn/components/Promote/controllers/render');

  /**
   *  @description
   */

  Promote.prototype.get             =     require('syn/components/Promote/controllers/get');

  /**
   *  @description
   */

  Promote.prototype.finish          =     require('syn/components/Promote/controllers/finish');

  /**
   *  @description
   */

  Promote.prototype.save            =     require('syn/components/Promote/controllers/save');

  module.exports = Promote;

} ();
