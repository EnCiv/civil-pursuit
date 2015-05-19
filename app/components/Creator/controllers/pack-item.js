! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function packItem () {
    
    var item = {
      type:           this.panel.type,
      subject:        this.find('subject').val(),
      description:    this.find('description').val(),
      user:                 
      
      
      
app.socket.synuser
    };

    // Parent

    if ( this.panel.parent ) {
      item.parent = this.panel.parent;
    }

    // References

    if ( this.find('reference').val() ) {
      item.references = [{ url: this.find('reference').val() }];

      if ( this.find('reference board').text() && this.find('reference board').text() !== 'Looking up title' ) {
        item.references[0].title = this.find('reference board').text();
      }
    }

    // Image

    if ( this.find('item media').find('img').length ) {

      // YouTube

      if ( this.find('item media').find('.youtube-preview').length ) {
        item.youtube = this.find('item media').find('.youtube-preview').data('video');
      }

      // Upload

      else {
        item.upload = this.find('item media').find('img').attr('src');
        item.image = item.upload;
      }
    }
 
    this.packaged = item;
  }

  module.exports = packItem;

} ();
