! function () {
  
  'use strict';

  var html5     =   require('syn/lib/html5');
  var Element   =   html5.Element;
  var Elements  =   html5.Elements;
  var ItemView  =   require('syn/views/Item');

  module.exports = function CreatorView (options) {

    options = options || {};

    // DROP BOX FOR IMAGE UPLOAD

    var dropBox = html5.Elements(

      Element('article.item-media.phasing').has(

        Element('.drop-box').has(
          Element('.modern').has(
            Element('h4').text('Drop image here'),
            Element('p').text('or')
          ),

          Element('.phasing').has(
            Element('button.upload-image-button', {
              type  : 'button',
              $text : 'Choose a file'
            })
          ),

          Element('input.hide', { type: 'file', value: 'Upload image' })
        )
      )

    );

    var itemBox   =   ItemView({
      media       :   dropBox,
      buttons     :   html5.Elements(
        Element('button.button-create.shy.medium').add(
          Element('i.fa.fa-bullhorn')
        )
      )
    });

    itemBox
      .find('h4.item-subject.header')
      .each(function (subject) {
        subject.add(
          Element('input', {
            type          :   'text',
            placeholder   :   'Item subject',
            required      :   'required',
            name          :   'subject',
            $selfClosing  :   true
          })
        );
      });

    itemBox
      .find('.item-description')
      .each(function (description) {
        delete description.options.$text;

        description.add(
          Element('textarea', {
            placeholder   :   'Item description',
            required      :   'required',
            name          :   'description'
          })
        );
      });

    var form = Element('form.creator.is-container', {
      name    :   'create'
    });

    return form.add(Element('.is-section').add(itemBox));

  };

} ();
