! function () {

  'use strict';

  function handler (e) {
    hover(e);

    var files = e.target.files || e.dataTransfer.files;

    for (var i = 0, f; f = files[i]; i++) {
      parse(f);
      upload(f);
    }
  }

  function hover (e) {
    e.stopPropagation();
    e.preventDefault();
    // e.target.className = (e.type == "dragover" ? "hover" : "");
  }

  function parse (file) {
    console.warn('file parsed', file);
  }

  function upload (file) {
    if ( /^image\//.test(file.type) && file.size < 50000 ) {
      $.ajax({
        url: '/upload',
        type: 'POST',
        headers: {
          'X_FILENAME': file.name
        }
      });
    }
  }

  function init (dropbox) {
    if ( window.File ) {
      dropbox.find('input').on('change', handler);
      dropbox.on('dragover', hover);
      dropbox.on('dragleave', hover);
      dropbox.on('drop', handler);
    }
  }

  module.exports = init;

} ();
