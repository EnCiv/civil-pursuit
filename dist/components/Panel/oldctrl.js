'use strict';

function _PanelComponent_() {

  'use strict';

  /** Providers */

  var Nav = require('syn/lib/util/Nav');
  var Session = require('syn/lib/app/Session');

  /** Components */

  var Creator = require('syn/components/Creator/Controller');
  var Item = require('syn/components/Item/Controller');

  /**
   *  @class
   *
   *  @arg {Object} type
   *  @arg {ObjectID?} parent
   *  @arg {Number} size
   *  @arg {Number} skip
   */

  function Panel(type, parent, size, skip) {

    if (!app) {
      throw new Error('Missing app');
    }

    var panel = this;

    this.id = Panel.getId(this);
  }

  Panel.getId = function (panel) {
    var id = 'panel-' + (panel.type._id || panel.type);

    if (panel.parent) {
      id += '-' + panel.parent;
    }

    return id;
  };

  /**
   *  @method       Panel.getId
   *  @return       {String} panelId
  */

  Panel.prototype.getId = function () {
    return this.id;
  };

  Panel.prototype.load = require('syn/components/Panel/controllers/load');

  Panel.prototype.find = function (name) {
    switch (name) {
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

    if (Session.isIn()) {
      Nav.toggle(this.find('creator'), this.template, app.domain.intercept());
    } else {
      Sign.dialog.join();
    }
  };

  Panel.prototype.render = require('syn/components/Panel/controllers/render');

  Panel.prototype.toJSON = require('syn/components/Panel/controllers/to-json');

  Panel.prototype.fill = require('syn/components/Panel/controllers/fill');

  Panel.prototype.preInsertItem = require('syn/components/Panel/controllers/pre-insert-item');

  Panel.prototype.insertItem = function (items, i, cb) {

    var self = this;

    if (items[i]) {

      var item = new Item(items[i]);

      console.log('inserting item ', i, item);

      item.load(app.domain.intercept(function (template) {
        self.find('items').append(template);

        item.render(app.domain.intercept(function () {
          self.insertItem(items, ++i, cb);
        }));
      }));
    } else {
      cb && cb();
    }
  };

  module.exports = Panel;
}