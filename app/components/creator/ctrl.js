'use strict';

import Controller             from '../../lib/app/controller';
import Panel                  from '../panel/ctrl';
import render                 from './controllers/render';
import create                 from './controllers/create';
import created                from './controllers/created';
import packItem               from './controllers/pack-item';
import renderReferences       from './controllers/references';
import getTitle               from './controllers/get-title';

var text = {
  'looking up title': 'Looking up'
};

class Creator extends Controller {

  get parent () {
    return $('#' + Panel.getId(this.props.panel));
  }

  get template () {
    return this.parent.find('>.panel-body > .creator');
  }

  constructor (props, panelContainer) {
    super();

    this.props = props || {};

    this.panel = props.panel;

    this.panelContainer = panelContainer;
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

  renderReferences () {
    return renderReferences.apply(this, ['creator']);
  }

  getTitle (url) {
    return getTitle.apply(this, [url]);
  }

  create (cb) {
    return create.apply(this, [cb]);
  }

  packItem (item) {
    return packItem.apply(this, [item]);
  }

  created (item) {
    return created.apply(this, [item]);
  }

}

export default Creator;
