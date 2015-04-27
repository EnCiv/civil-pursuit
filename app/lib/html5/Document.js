! function () {
  
  'use strict';

  var Elements = require('./Elements');

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

  Document.prototype.add = function () {
    for ( var i in arguments ) {
      this.children.push(arguments[i]);
    }
  };

  Document.prototype.toHTML = function (locals) {
    var l = ['<!DOCTYPE html>'];

    l.push('<meta charset="utf-8" />');

    console.log()
    console.log()
    console.log()
    console.log()
    console.log()
    console.log()
    console.log('Document children', this.children)
    console.log()
    console.log()
    console.log()
    console.log()
    console.log('document children to Elements', new Elements(this.children))
    console.log()
    console.log()
    console.log()
    console.log()
    console.log()
    console.log()
    console.log()

    l.push(new Elements(this.children).toHTML(locals));

    return l.join("\n");
  };

  module.exports = Document;

} ();
