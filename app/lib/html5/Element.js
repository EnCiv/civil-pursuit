! function () {
  
  'use strict';

  module.exports = Element;
  var toHTML = require('./toHTML');
  var Elements =  require('./Elements');

  /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   *  HTML5 ELEMENT
   *  -------------
   *
   *  @method
   *  @arg          {String | Function} selector
   *  @arg          {Object | Function} attr
   *  @arg          {Array | Function} children
   *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */

  function Element (selector, attr, children) {

    if ( this instanceof Element === false ) {
      return new Element(selector, attr, children);
    }

    this.selector   =   selector;
    this.options    =   attr || {};
    this.children   =   children || [];
  }

  /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   *  Add children
   *  -------------
   *
   *  @method
   *  @arg          ..{Element | Function} child
   *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */

  Element.prototype.add = function () {
    for ( var i in arguments ) {
      this.children.push(arguments[i]);
    }

    return this;
  };

  Element.prototype.text = function(text) {
    this.options.$text = text;
    return this;
  };

  Element.prototype.find = function (selector) {
    var elements = [];

    function findElements (selector, element) {

      if ( element instanceof Element ) {
        if ( element.is(selector) ) {
          elements.push(element);
        }

        element.children.forEach(function (child) {
          findElements(selector, child);
        });
      }

      else if ( element instanceof Elements ) {
        element.each(function (child) {
          findElements(selector, child);
        });
      }

    }

    this.children.forEach(function (child) {
      findElements(selector, child);
    });

    return new Elements(elements);
  };

  Element.prototype.is = function(selector) {
    return Element.is(this, selector);
  };

  Element.prototype.toHTML = function (locals, tab) {
    return toHTML(this, locals, tab);
  };

  /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   *  Shortcut for link css
   *  ---------------------------------
   *
   *  @method
   *  @arg          {String} href
   *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */

  Element.styleSheet = function (href) {
    return Element('link', {
      rel           :   'stylesheet',
      type          :   'text/css',
      href          :   href,
      $selfClosing  :   true
    });
  };

  /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   *  Shortcut for script src
   *  ---------------------------------
   *
   *  @method
   *  @arg          {String} src
   *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */

  Element.importScript = function (src) {
    return Element('script', { src : src });
  };

  /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   *  Shortcut for title
   *  ------------------
   *
   *  @method
   *  @arg          {String} title
   *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */

  Element.title = function (title) {
    return Element('title', { $text: title });
  };

  /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   *  Resolve a selector string to a Element
   *  ------------------------------------------
   *
   *  @method
   *  @return       Element
   *  @arg          {String | Function} selector
   *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */

  Element.resolve = function (selector) {
    var resolved = { classes: [] };

    var trans = selector
      .replace(/\./g, '|.')
      .replace(/#/g, '|#');

    var bits = trans.split(/\|/);

    bits.forEach(function (bit) {

      if ( /^\./.test(bit) ) {
        resolved.classes.push(bit.replace(/^\./, ''));
      }

      else if ( /^#/.test(bit) ) {
        resolved.id = bit.replace(/^#/, '');
      }

      else if ( /^[A-Za-z-_\$]/.test(bit) ) {
        resolved.element = bit;
      }

    });

    return resolved;
  }

  /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   *  Tell if an elem matches the given selector
   *  ------------------------------------------
   *
   *  @method
   *  @return       Boolean
   *  @arg          {Element} selector
   *  @arg          {String} selector
   *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */

  Element.is = function (elem, selector) {

    var dest = Element.resolve(selector);

    var src = Element.resolve(elem.selector);

    var attempts = [];

    if ( dest.element ) {
      attempts.push('element', src.element === dest.element);
    }

    if ( dest.classes.length ) {
      attempts.push('classes', src.classes.some(function (cl) {
        return dest.classes.some(function (_cl) {
          return _cl === cl;
        });
      }));
    }

    if ( dest.id ) {
      attempts.push('id',src.id === dest.id);
    }

    return attempts.every(function (attempt) {
      return attempt;
    });
  };

} ();
