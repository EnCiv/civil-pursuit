! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function find (name) {
    switch ( name ) {
      case "subject":             return this.template.find('.item-subject:first a');

      case "description":         return this.template.find('.item-description:first');

      case "reference":           return this.template.find('.item-reference:first a');

      case "media":               return this.template.find('.item-media:first');

      case "youtube preview":     return this.template.find('.youtube-preview:first');

      case "toggle promote":      return this.template.find('.item-toggle-promote:first');

      case "promote":             return this.template.find('.promote:first');

      case "toggle details":      return this.template.find('.item-toggle-details:first');

      case "details":             return this.template.find('.details:first');

      case "editor":              return this.template.find('.editor:first');

      case "toggle arrow":        return this.template.find('.item-arrow:first');

      case "promotions":          return this.template.find('.promoted:first');

      case "promotions %":        return this.template.find('.promoted-percent:first');

      case "children":            return this.template.find('.children:first');

      case "collapsers":          return this.template.find('.item-collapsers:first');

      case "collapsers hidden":   return this.template.find('.item-collapsers:first:hidden');

      case "collapsers visible":  return this.template.find('.item-collapsers:first:visible');

      case "related count"          :   return this.template.find('.related-count');

      case "related count plural"   :   return this.template.find('.related-count-plural');
    }
  }

  module.exports = find;

} ();
