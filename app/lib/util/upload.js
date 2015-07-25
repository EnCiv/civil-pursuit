'use strict';

import { EventEmitter } from 'events';

class Upload extends EventEmitter {
  
  constructor (dropzone, fileInput, thumbnail) {
    super();

    this.dropzone     =   dropzone;
    this.fileInput    =   fileInput;
    this.thumbnail    =   thumbnail;
  }

  init () {
    if ( window.File ) {
      if ( this.dropzone ) {
        this.dropzone
          .on('dragover',   this.hover.bind(this))
          .on('dragleave',  this.hover.bind(this))
          .on('drop',       this.handler.bind(this));
      }

      if ( this.fileInput ) {
        this.fileInput.on('change', this.handler.bind(this));
      }
    }

    else {
      if ( dropzone ) {
        dropzone.find('.modern').hide();
      }
    }
  }

  destroy () {
    if ( window.File ) {
      if ( this.dropzone ) {
        this.dropzone
          .off('dragover')
          .off('dragleave')
          .off('drop');
      }

      if ( this.fileInput ) {
        this.fileInput.off('change');
      }
    }

    return this;
  }

  hover (e) {
    e.stopPropagation();
    e.preventDefault();
  }

  handler (e) {
    this.hover(e);

    var files = e.target.files || e.originalEvent.dataTransfer.files;

    for (var i = 0, f; f = files[i]; i++) {
      this.preview(f, e.target);
    }
  }

  preview (file, target) {
    var upload = this;

    var img = new Image();

    img.classList.add("img-responsive");
    img.classList.add("preview-image");
    
    img.addEventListener('load', function () {

      $(img).data('file', file);

      upload.thumbnail.empty().append(img);

    }, false);
    
    img.src = (window.URL || window.webkitURL).createObjectURL(file);

    this.emit('uploaded', file);
  }

}

export default Upload;
