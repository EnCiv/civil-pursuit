'use strict';

import Milk from 'syn/lib/app/milk';
import YouTubeView from 'syn/components/YouTube/View';

class Item extends Milk {

  constructor (props) {

    props = props || {};

    let options = { viewport : props.viewport };

    super('Item', options);

    this.props = props || {};

    let get = this.get.bind(this);
    let find = this.find.bind(this);

    let item = this.props.item;

    let itemIsAnObject = typeof item === 'object';
    let itemIsASelector = typeof item === 'string';

    console.log('item', item)

    if ( this.props.driver !== false ) {
      this.go('/');
    }

    this
      
      .set('Item', () => find('#item-' + item._id), null, itemIsAnObject)

      .set('Item', () => find(item), null, itemIsASelector)
      
      .set('Media Wrapper', () => this.find(
        get('Item').selector + '>.item-media-wrapper'
      ))

      .set('Media', () => this.find(
        get('Media Wrapper').selector + '>.item-media'
      ))
      
      .set('Image', () => this.find(
        get('Media').selector + ' img.img-responsive'
      ))
      
      .set('Video Container', () => this.find(
        get('Media Wrapper').selector + ' .video-container'
      ))
      
      .set('Iframe', () => this.find(
        get('Video Container').selector + ' iframe'
      ));

    this

      .ok(() => get('Item').is(':visible'))
      .ok(() => get('Item').is('.item'))
      .ok(() => get('Media Wrapper').is(':visible'))
      .ok(() => get('Media').is(':visible'));

    if ( itemIsAnObject && YouTubeView.isYouTube(item) ) {
      this
        .ok(() => get('Video Container').is(':visible'))
        .wait(1)
        .ok(() => get('Iframe').is(':visible'))
        .ok(() => get('Iframe').width()
          .then(width => width.should.be.exactly(183))
        )
        .ok(() => get('Iframe').height()
          .then(height => height.should.be.exactly(133))
        );
    }

    else if ( itemIsAnObject ) {
      this
        .ok(() => get('Image').is(':visible'))
        .ok(() => get('Image').width()
          .then(width => width.should.be.exactly(183))
        )
        .ok(() => get('Image').height()
          .then(height => height.should.be.exactly(122))
        );
    }
  }

}

export default Item;
