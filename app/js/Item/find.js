! function () {
  
  'use strict';

  var selectors = require('syn/components/selectors.json');

  function find (name) {

    var comp = this;

    function _find (selector) {
      return comp.template.find(selectors[selector]);
    }

    switch ( name ) {
      case "subject":             return _find('Item Subject');

      case "description":         return _find('Item Description');

      case "toggle promote":      return _find('Item Toggle Promote');

      case "promote":             return _find('Promote');



      case "reference":           return this.template.find('.item-reference:first a');

      case "media":               return this.template.find('.item-media:first');

      case "youtube preview":     return this.template.find('.youtube-preview:first');

      case "toggle details":      return this.template.find('.item-toggle-details:first');

      case "details":             return this.template.find('.details:first');

      case "editor":              return this.template.find('.editor:first');

      case "toggle arrow":        return this.template.find('.item-arrow:first');

      case "promotions":          return this.template.find('.promoted:first');

      case "promotions %":        return this.template.find('.promoted-percent:first');

      case "children":            return this.template.find('.children:first');

      case "collapsers"             :   return this.template.find('.item-collapsers:first');

      case "collapsers hidden"      :   return this.template.find('.item-collapsers:first:hidden');

      case "collapsers visible"     :   return this.template.find('.item-collapsers:first:visible');

      case "related count"          :   return this.template.find('.related-count');

      case "related"                :   return this.template.find('.related');

      case "related count plural"   :   return this.template.find('.related-count-plural');

      case "related name"           :   return this.template.find('.related-name');
    }
  }

  module.exports = find;

} ();
