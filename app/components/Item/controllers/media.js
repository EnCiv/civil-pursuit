'use strict';

import YouTube from 'syn/components/YouTube/View';

function MediaController () {
  let item = this.get('item');

  let references = item.references || [];

  // YouTube

  if ( references.length ) {

    let youtube = new YouTube({
      settings: { env: synapp.props.settings.env },
      item: item
    });

    if ( youtube.children.length ) {
      let {element} = YouTube.resolve(youtube.children[0].selector);

      if ( element === 'iframe' ) {
        return $(youtube.render());
      }
    }
  }

  // adjustImage

  if ( item.adjustImage ) {
    return $(item.adjustImage
      .replace(/\>$/, ' class="img-responsive" />'));
  }

  // Item has image

  if ( item.image && /^http/.test(item.image) ) {
    let src = item.image;

    let image = $('<img/>');

    image.addClass('img-responsive');

    image.attr('src', synapp.config['default item image']);

    this
      .publish('format cloudinary image', src, item._id.toString())
      .subscribe((pubsub, img, _id) => {
        if ( _id === item._id.toString() ) {
          image.attr('src', img);
          pubsub.unsubscribe();
        }
      });

    return image;
  }

  // YouTube Cover Image

  if ( item.youtube ) {
    return $(new YouTube({
      item: {
        references: [{
          url : 'http://youtube.com/watch?v=' + item.youtube
        }]
      },
      settings: { env: synapp.props.settings.env }
    }).render());
  }

  // Uploaded image

  // if ( item.upload ) {
  //   var src = item.image;

  //   var image = $('<img/>');

  //   image.addClass('img-responsive');

  //   image.attr('src', item.upload);

  //   return image;
  // }

  // default image

  var image = $('<img/>');

  image.addClass('img-responsive');

  image.attr('src', synapp.config['default item image']);

  return image;

}

export default MediaController;
