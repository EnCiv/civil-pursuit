! function () {
  
  'use strict';

  module.exports = Elements;

  var Element = require('./Element');

  function Elements (elements) {

    var args = [];

    for ( var i in arguments ) {
      args.push(arguments[i]);
    }

    this.elements = [];

    var arg;

    function parse () {
      for ( var i in arguments ) {
        if ( arguments[i] instanceof Element ) {
          this.elements.push(arguments[i]);
        }

        else if ( arguments[i] instanceof Elements ) {
          this.elements.push(arguments[i]);
        }

        else if ( typeof arguments[i] === 'function' ) {
          this.elements.push(arguments[i]);
        }
      }
    }

    if ( Array.isArray(elements) && arguments.length === 1 ) {
      elements.forEach(parse, this);
    }

    else {
      parse.apply(this, args);
    }

    if ( this instanceof Elements === false ) {
      var elements        =   new Elements();
      elements.elements   =   this.elements;
      return elements;
    }

  }

  Elements.prototype.each = function (closure) {
    this.elements.forEach(closure);
    return this;
  };

  Elements.prototype.forEach = function (closure) {
    this.elements.forEach(closure);
    return this;
  };

  Elements.prototype.find = function (selector) {
    var found = [];

    this.elements.forEach(function (child) {
      child.find(selector).each(function (result) {
        found.push(result);
      });
    });

    return new Elements(found);
  };

  Elements.prototype.toHTML = function (locals, tab) {
    return this.elements
      .map(function (element) {
        if ( element instanceof Element ) {
          return element.toHTML(locals, tab);
        }

        if ( element instanceof Elements ) {
          return element.toHTML(locals, tab);
        }
        
        if ( typeof element === 'function' ) {

          var elem = element(locals);

          if ( elem instanceof Element || elem instanceof Elements ) {
            return elem.toHTML(locals, tab);
          }
        }
      })
      .join("\n");
  };

} ();
