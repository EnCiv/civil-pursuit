'use strict';

import Upload from '../../../lib/util/upload';

function uploader () {
  // Emulate input type file's behavior with button

  this.find('upload image button').on('click',  () => {
    this.find('dropbox').find('[type="file"]').click();
  });

  // Use upload service

  let upload = new Upload(
    this.find('dropbox'),
    this.find('dropbox').find('input'),
    this.template.find('.uploaded-image')
  );

  upload.init();

  upload.on('uploaded', () => {
    this.find('dropbox').css('display', 'none');
    this.template.find('.choose-another-image').css('display', 'block');
  });

  // Upload another image
  this.template.find('.back-to-dropbox').on('click', e => {
    e.preventDefault();
    this.template.find('.choose-another-image').css('display', 'none');
    this.template.find('.uploaded-image').empty();
    this.find('dropbox').css('display', 'block');
    upload
      .destroy()
      .init();
    this.find('dropbox').find('[type="file"]').click();
  });
}

export default uploader;
