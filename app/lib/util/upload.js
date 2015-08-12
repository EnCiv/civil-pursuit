'use strict';

import { EventEmitter } from 'events';

class Upload extends EventEmitter {

  constructor (dropzone, fileInput, thumbnail, replace) {
    super();

    this.dropzone     =   dropzone;
    this.fileInput    =   fileInput;
    this.thumbnail    =   thumbnail;
    this.replace      =   replace;
  }

  init () {
    if ( window.File ) {
      if ( this.dropzone ) {
        console.log('Upload', 'enable dropzone');
        this.dropzone.addEventListener('dragover',   this.hover.bind(this), false);
        this.dropzone.addEventListener('dragleave',  this.hover.bind(this), false);
        this.dropzone.addEventListener('drop',       this.handler.bind(this), false);
      }

      if ( this.fileInput ) {
        this.fileInput.addEventListener('change', this.handler.bind(this), false);
      }
    }

    else {
      if ( dropzone ) {
        dropzone.querySelector('.modern').style.display = 'none';
      }
    }
  }

  destroy () {
    if ( window.File ) {
      if ( this.dropzone ) {
        this.dropzone.removeEventListener('dragover');
        this.dropzone.removeEventListener('dragleave');
        this.dropzone.removeEventListener('drop');
      }

      if ( this.fileInput ) {
        this.fileInput.removeEventListener('change');
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

    var img = new Image();

    img.classList.add("syn-img-responsive");
    img.classList.add("preview-image");

    img.addEventListener('load', () => {

      img.dataset.file = file;

      this.thumbnail.style.display = 'block';

      this.thumbnail.innerHTML = '';

      this.thumbnail.appendChild(img);

      this.dropzone.style.display = 'none';

      this.replace.style.display = 'block';

    }, false);

    img.src = (window.URL || window.webkitURL).createObjectURL(file);

    this.emit('uploaded', file);
  }

}

export default Upload;
