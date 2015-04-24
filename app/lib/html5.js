! function () {
  
  'use strict';

  function Html5 () {

  }

  Html5.prototype.toHTML = function () {
    var l = ['<!DOCTYPE html>'];

    l.push('<meta charset="utf-8" />');

    return l.join("\n");
  };

  module.exports = Html5;

} ();
