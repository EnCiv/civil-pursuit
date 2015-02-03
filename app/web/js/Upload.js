! function () {

  'use strict';

  function Upload (dropzone, file_input, thumbnail, cb) {
    this.dropzone = dropzone;
    this.file_input = file_input;
    this.thumbnail = thumbnail;
    this.cb = cb;


    this.init();
  }

  Upload.prototype.init = function () {
    console.log("let's do some upload", {
      dropzone: this.dropzone,
      file_input: this.file_input,
      thumbnail: this.thumbnail
    })

    if ( window.File ) {
      if ( this.dropzone ) {
        this.dropzone
          .on('dragover',   this.hover.bind(this))
          .on('dragleave',  this.hover.bind(this))
          .on('drop',       this.handler.bind(this));
      }

      if ( this.file_input ) {
        this.file_input.on('change', this.handler.bind(this));
      }
    }

    else {
      if ( dropzone ) {
        dropzone.find('.modern').hide();
      }
    }
  };

  Upload.prototype.hover = function (e) {
    e.stopPropagation();
    e.preventDefault();
  };

  Upload.prototype.handler = function (e) {
    this.hover(e);

    var files = e.target.files || e.originalEvent.dataTransfer.files;

    for (var i = 0, f; f = files[i]; i++) {
      this.preview(f, e.target);
    }
  };

  Upload.prototype.preview = function(file, target) {
    var upload = this;

    var img = new Image();

    img.classList.add("img-responsive");
    img.classList.add("preview-image");
    
    img.addEventListener('load', function () {

      $(img).data('file', file);

      upload.thumbnail.empty().append(img);

    }, false);
    
    img.src = (window.URL || window.webkitURL).createObjectURL(file);

    if ( this.cb ) {
      this.cb(null, file);
    }
  };

  function handler (e) {
    hover(e);

    var files = e.target.files || e.originalEvent.dataTransfer.files;

    for (var i = 0, f; f = files[i]; i++) {
      parse(f);
      preview(f, e.target);
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
    else if ( $(target).closest('.drop-box').length ) {
      dropbox = $(target).closest('.drop-box');
    }

    var img = new Image();

    img.classList.add("img-responsive");
    img.classList.add("preview-image");
    
    img.addEventListener('load', function () {
      $(img).insertAfter(dropbox);
      $(img).data('file', file);
      dropbox.css('display', 'none');
    }, false);
    
    img.src = (window.URL || window.webkitURL).createObjectURL(file);
  }

  function init (dropbox) {

    if ( window.File ) {
      console.log('we have File', dropbox.attr('type'))
      if ( dropbox.hasClass('dropbox') ) {
        dropbox
          .on('dragover', hover)
          .on('dragleave', hover)
          .on('drop', handler)
          .find('input')
            .on('change', handler);
      }
      else if ( dropbox.attr('type') === 'file' ) {
        console.log('rock n roll');
        dropbox.on('change', handler);
      }
    }

    else {
      dropbox.find('.modern').hide();
    }
  }

  module.exports = Upload;

} ();
