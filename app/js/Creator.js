/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  C   R   E   A   T   O   R

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function () {

  'use strict';

  var Panel     =   require('./Panel');

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

    if ( ! ( panel instanceof require('./Panel') ) ) {
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

  Creator.prototype.render      =   require('./Creator/render');

  Creator.prototype.create      =   require('./Creator/create');

  Creator.prototype.created     =   require('./Creator/created');

  Creator.prototype.packItem    =   require('./Creator/pack-item');

  module.exports = Creator;

} ();
