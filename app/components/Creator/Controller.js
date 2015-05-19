'use strict';

import Controller from 'syn/lib/app/Controller';
import Panel from 'syn/components/Panel/Controller';
import render from 'syn/components/Creator/controllers/render';

var text = {
  'looking up title': 'Looking up'
};

class Creator extends Controller {

  get template () {
    return $('#' + this.props.panel.id).find('.creator:first');
  }

  constructor (props) {
    super();

    this.props = props || {};

    this.panel = props.panel;
  }

  find (name) {
    switch ( name ) {
      case 'create button':           return this.template.find('.button-create:first');

      case 'form':                    return this.template.find('form');

      case 'dropbox':                 return this.template.find('.drop-box');

      case 'subject':                 return this.template.find('[name="subject"]');

      case 'description':             return this.template.find('[name="description"]');

      case 'item media':              return this.template.find('.item-media');

      case 'reference':               return this.template.find('.reference');

      case 'reference board':         return this.template.find('.reference-board');

      case 'upload image button':     return this.template.find('.upload-image-button');
    }
  }

  render (cb) {
    return render.apply(this, [cb]);
  }

}

export default Creator;





function foo () {

  'use strict';

  module.exports = Creator;

  var Panel     =   require('syn/components/Panel/Controller');

  var text      =   {
    'looking up title': 'Looking up'
  };

  /**
   *  @class
   *  @arg {Panel} - panel
   */

  function Creator (panel) {

    if ( ! app ) {
      throw new Error('Missing app');
    }

    if ( ! ( panel instanceof require('syn/components/Panel/Controller') ) ) {
      throw new Error('Creator: Panel must be a Panel object');
    }

    this.panel = panel;

    this.template = $('#' + this.panel.getId()).find('.creator:first');
  }

  Creator.prototype.find = function (name) {
    switch ( name ) {
      case 'create button':           return this.template.find('.button-create:first');

      case 'form':                    return this.template.find('form');

      case 'dropbox':                 return this.template.find('.drop-box');

      case 'subject':                 return this.template.find('[name="subject"]');

      case 'description':             return this.template.find('[name="description"]');

      case 'item media':              return this.template.find('.item-media');

      case 'reference':               return this.template.find('.reference');

      case 'reference board':         return this.template.find('.reference-board');

      case 'upload image button':     return this.template.find('.upload-image-button');
    }
  };

  Creator.prototype.render      =   require('syn/components/Creator/controllers/render');

  Creator.prototype.create      =   require('syn/components/Creator/controllers/create');

  Creator.prototype.created     =   require('syn/components/Creator/controllers/created');

  Creator.prototype.packItem    =   require('syn/components/Creator/controllers/pack-item');

}
