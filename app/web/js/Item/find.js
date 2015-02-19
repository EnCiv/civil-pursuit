! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function find (name) {
    switch ( name ) {
      case 'subject':
        return this.template.find('.item-title:first a');

      case 'description':
        return this.template.find('.description:first');

      case 'reference':
        return this.template.find('.item-references:first a');

      case 'media':
        return this.template.find('.item-media:first');

      case 'youtube preview':
        return this.template.find('.youtube-preview:first');

      case 'toggle promote':
        return this.template.find('.toggle-promote:first');

      case 'promote':
        return this.template.find('.evaluator:first');

      case 'toggle details':
        return this.template.find('.toggle-details:first');

      case 'details':
        return this.template.find('.details:first');

       case 'editor':
        return this.template.find('.editor:first');

      case 'toggle arrow':
        return this.template.find('>.toggle-arrow');

      case 'promotions':
        return this.template.find('.promoted:first');

      case 'promotions %':
        return this.template.find('.promoted-percent:first');

      case 'children':
        return this.template.find('.children:first');
    }
  }

  module.exports = find;

} ();
