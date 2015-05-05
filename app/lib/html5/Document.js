! function () {
  
  'use strict';

  var Elements = require('./Elements');
  var Element = require('./Element');

  function Document () {
    var children = [];

    for ( var i in arguments ) {

      if ( Array.isArray(arguments[i]) ) {
        children = children.concat(arguments[i]);
      }

      else {
        children.push(arguments[i]);
      }
    }

    if ( this instanceof Document === false ) {
      return new Document(children);
    }

    this.children = children;
  }

  /**
   *  @return     Document
   */

  Document.prototype.add = function () {
    for ( var i in arguments ) {
      this.children.push(arguments[i]);
    }

    return this;
  };

  /**
   *  @arg        {String} selector
   *  @return     Elements
   */

  Document.prototype.find = function (selector) {
    var found = [];

    this.children.forEach(function (child) {

      if ( child instanceof Element ) {
        if ( child.is(selector) ) {
          found.push(child);
        }
      }

      child.find(selector).each(function (result) {
        found.push(result);
      });
    });

    return new Elements(found);
  };

  /**
   *  @arg        {Mixed} locals
   *  @return     String
   */

  Document.prototype.toHTML = function (locals) {
    var l = ['<!DOCTYPE html>'];

    l.push('<meta charset="utf-8" />');

    l.push(new Elements(this.children).toHTML(locals));

    return l.join("\n");
  };

  module.exports = Document;

} ();
