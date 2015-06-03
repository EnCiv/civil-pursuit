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

    let useDefaultButtons = this.props.button;

    console.log('item', item)

    if ( this.props.driver !== false ) {
      this.go('/');
    }

    this
      
      .set('Item', () => find('#item-' + item._id), null, () => itemIsAnObject)

      .set('Item', () => find(item), null, () => itemIsASelector)
      
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
      ))

      .set('Buttons', () => this.find(
        get('Item').selector + '>.item-buttons'
      ))

      .set('Text', () => this.find(
        get('Item').selector + '>.item-text'
      ))

      .set('Truncatable', () => this.find(
        get('Text').selector + '>.item-truncatable'
      ))

      .set('Subject', () => this.find(
        get('Text').selector + ' h4.item-subject.header'
      ))

      .set('Description', () => this.find(
        get('Text').selector + ' .item-description.pre-text'
      ))

      .set('Toggle promote', () => this.find(
        get('Buttons').selector + ' button.item-toggle-promote'
      ))

      .set('Toggle details', () => this.find(
        get('Buttons').selector + ' .item-toggle-details'
      ))

      .set('Related', () => this.find(
        get('Buttons').selector + ' span.related'
      ));

    this

      .ok(() => get('Item').is(':visible'))
      .ok(() => get('Item').is('.item'))
      .ok(() => get('Media Wrapper').is(':visible'))
      .ok(() => get('Media').is(':visible'))
      .ok(() => get('Buttons').is(':visible'))
      .ok(() => get('Text').is(':visible'));

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
        )
        .ok(() => get('Image').attr('src')
          .then(src => src.should.be.exactly(item.image))
        );
    }

    if ( itemIsAnObject ) {

      // VERIFY TEXT

      this
        .ok(() => get('Truncatable').is(':visible'))
        
        .ok(() => get('Subject').is(':visible'))
        .ok(() => get('Subject').text()
          .then(text => text.should.be.exactly(item.subject)))

        .ok(() => 
          Promise.all([
            get('Description').count('.more'),
            get('Description').text()
          ])
          .then(results => {
            let more = results[0];
            let text = results[1];
            
            if ( ! more ) {
              text.should.be.exactly(Milk.formatToHTMLText(item.description));
            }
          })
        )
    
      // BUTTONS

      if ( this.props.buttons !== false ) {
        this
          .ok(() => get('Toggle promote').is(':visible'))
          .ok(() => get('Toggle promote').text()
            .then(text => (+text).should.be.exactly(item.promotions)))
          .ok(() => get('Toggle details').is(':visible'))
          .ok(() => get('Toggle details').text()
            .then(text => text.should.be.exactly(
              item.popularity.number.toString() + '%')))
          .ok(() => get('Related').is(':visible'))
          .ok(() => get('Related').text()
            .then(text => (+text).should.be.exactly(item.children)));
      }
    }

    // useDefaultButtons
  }

}

export default Item;
