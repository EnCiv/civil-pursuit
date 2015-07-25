'use strict';

import Controller         from  '../../lib/app/controller';
import Nav                from  '../../lib/util/nav';
import Form               from  '../../lib/util/form';
import View               from  './view';
import ItemCtrl           from  '../item/ctrl';
import renderReferences   from  '../creator/controllers/references';
import getTitle           from  '../creator/controllers/get-title';
import uploader           from  '../creator/controllers/upload';

class EditAndGoAgainCtrl extends Controller {

  constructor (props) {
    super();

    this.item = props.item;

    this.find = this.find.bind(this);
  }

  load () {
    this.template = $(new View().render());
    this.template.data('editor', this);
  }

  find (name) {
    switch ( name ) {
      case 'create button':
        return this.template.find('.button-create:first');

      case 'dropbox':
        return this.template.find('.drop-box');

      case 'subject':
        return this.template.find('[name="subject"]');

      case 'description':
        return this.template.find('[name="description"]');

      case 'item media':
        return this.template.find('.item-media');

      case 'reference':
        return this.template.find('.reference');

      case 'reference board':
        return this.template.find('.reference-board');

      case 'upload image button':
        return this.template.find('.upload-image-button');
    }
  }

  render () {

    this.template.find('[name="subject"]').val(this.item.get('item').subject);

    this.template.find('[name="description"]')
      .val(this.item.get('item').description)
      .autogrow();

    if ( this.item.get('item').references.length ) {
      this.template.find('[name="reference"]')
        .val(this.item.get('item').references[0].url);
    }

    // Media

    this.template.find('.item-media')
      .empty()
      .append(this.item.media());

    // Upload image

    let chooseAnotherImage = $('<div class="text-center gutter"></div>');
    let chooseAnotherImageLink = $('<a href="">Choose another image</a>');
    let closeChooseAnotherImage = $('<i class="fa fa-times cursor-pointer"></i>');
    let gap = $('<span> </span>');

    chooseAnotherImage.append(closeChooseAnotherImage, gap, chooseAnotherImageLink);

    chooseAnotherImageLink.on('click', (e) => {
      e.preventDefault();
      let dropbox   = this.template.find('.drop-box');
      let itemMedia = this.template.find('.item-media');
      if ( dropbox.css('display') === 'none' ) {
        dropbox.css('display', 'block');
        itemMedia.find('>img, >iframe').css('display', 'none');
        itemMedia.find('.fa-times').css('display', 'inline');
      }
    });

    closeChooseAnotherImage.on('click', (e) => {
      let dropbox   = this.template.find('.drop-box');
      let itemMedia = this.template.find('.item-media');

      if ( dropbox.css('display') === 'block' ) {
        dropbox.css('display', 'none');
        itemMedia.find('>img, >iframe').css('display', 'inline');
        itemMedia.find('.fa-times')
          .css('display', 'none');
      }
    });

    this.template.find('.item-media')
      .append(chooseAnotherImage)
      .append($('.drop-box'));

    this.template.find('.drop-box').css('display', 'none');
    this.template.find('.item-media .fa-times').css('display', 'none');

    // References

    this.renderReferences();

    // Uploader

    this.uploader();

    // Form

    let form = new Form(this.template);

    form.send(this.save.bind(this));
  }

  renderReferences () {
    return renderReferences.apply(this, ['editor']);
  }

  uploader () {
    return uploader.apply(this);
  }

  getTitle (url) {
    return getTitle.apply(this, [url]);
  }

  save () {
    Nav.hide(this.template, this.domain.intercept(() => {
      Nav.hide(this.template.closest('.edit-and-go-again'), this.domain.intercept(() => {
        
        let newItem = this.toItem();

        this
          .publish('create item', newItem)
          .subscribe((pubsub, document) => {
            pubsub.unsubscribe();

            let item = new ItemCtrl({ item : document });

            item.load();

            item.template.insertBefore(this.item.template);

            item.render(this.domain.intercept(() => {
              item.find('toggle promote').click();
            }));
          });
      }));
    }));
  }

  toItem () {
    var item = {
      from          :     this.item.get('item')._id,
      subject       :     this.template.find('[name="subject"]').val(), /* 2 */
      description   :     this.template.find('[name="description"]').val(),
      user          :     this.socket.synuser,
      type          :     this.item.get('item').type
    };

    if ( this.template.find('.item-media').find('img').length ) {

      if ( this.template.find('.item-media').find('.youtube-preview').length ) {
        item.youtube = this.template.find('.item-media').find('.youtube-preview').data('video');
      }

      else {
        item.upload = this.template.find('.item-media').find('img').attr('src');
      }
    }
 
    return item;
  }

}

export default EditAndGoAgainCtrl;
