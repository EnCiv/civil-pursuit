! function () {

  'use strict';

  function handler (e) {
    hover(e);

    var files = e.target.files || e.dataTransfer.files;

    for (var i = 0, f; f = files[i]; i++) {
      parse(f);
    }
  }

  function hover (e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.className = (e.type == "dragover" ? "hover" : "");
  }

  function parse (file) {
    console.warn('file parsed', file);
  }

  function upload (dropbox) {
    if ( window.File ) {
      dropbox.find('input').on('change', handler);
    }
  }

  module.exports = upload;

} ();
