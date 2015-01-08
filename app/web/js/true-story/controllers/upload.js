! function () {

  'use strict';

  function handler (e) {
    hover(e);

    var files = e.target.files || e.originalEvent.dataTransfer.files;

    for (var i = 0, f; f = files[i]; i++) {
      parse(f);
      preview(f, e.target);
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

  function preview (file, target) {

    var dropbox;

    if ( $(target).hasClass('drop-box') ) {
      dropbox = $(target);
    }
    else {
      dropbox = $(target).closest('.drop-box');
    }

    var img = new Image();

    img.classList.add("img-responsive");
    
    img.addEventListener('load', function () {
      $(img).insertAfter(dropbox);
      dropbox.css('display', 'none');
    }, false);
    
    img.src = (window.URL || window.webkitURL).createObjectURL(file);

    console.warn(img);
  }

  function upload (file) {
    return;
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
