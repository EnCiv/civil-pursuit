! function () {
  
  'use strict';

  var html5     =   require('syn/lib/html5');
  var ItemView  =   require('syn/views/Item');

  module.exports = function CreatorView (options) {

    options = options || {};

    // DROP BOX FOR IMAGE UPLOAD

    var dropBox = Html5.Elements(

      html5.Element('article.item-media.padding', {}, [
        
        html5.Element('.drop-box', {}, [
          
          html5.Element('.modern', {}, [
            html5.Element('h4').text('Drop image here'),
            html5.Element('p').text('or')
          ]),
          
          html5.Element('.padding', {}, [
            html5.Element('button.upload-image-button', { type  : 'button' })
              .text('Choose a file')
          ]),

          html5.Element('input.hide', { type: 'file', value: 'Upload image' })
        ])
      ])

    );

    var itemBox   =   ItemView({
      media       :   dropBox,
      buttons     :   []
    });

    return html5.Element('form.creator.is-container')

      .add(
        html5.Element('.is-section', {}, itemBox)
      );

  };

} ();
