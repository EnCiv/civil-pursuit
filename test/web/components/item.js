'use strict';

import Milk from 'syn/lib/app/milk';
import YouTubeView from 'syn/components/YouTube/View';
import config from 'syn/config.json';

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

      .ok(() => get('Item').is(':visible'), 'Item is visible')
      .ok(() => get('Item').is('.item'), 'Item has the class ".visible"')
      .ok(() => get('Media Wrapper').is(':visible'), 'Item Media Wrapper is visible')
      .ok(() => get('Media').is(':visible'), 'Item Media is visible')
      .ok(() => get('Buttons').is(':visible'), 'Item Buttons are visible')
      .ok(() => get('Text').is(':visible'), 'Item Text is visible');

    if ( itemIsAnObject && YouTubeView.isYouTube(item) ) {
      this
        .ok(() => get('Video Container').is(':visible'), 'Item Video Container is visible')
        .wait(1)
        .ok(() => get('Iframe').is(':visible'), 'Item YouTube Iframe is visible')
        .ok(() => get('Iframe').width()
          .then(width => width.should.be.exactly(183)),
          'Iframe should be the exact width'
        )
        .ok(() => get('Iframe').height()
          .then(height => height.should.be.exactly(133)),
          'Iframe should be the exact height'
        );
    }

    else if ( itemIsAnObject ) {
      this
        .ok(() => get('Image').is(':visible'), 'Item Image is visible')
        .ok(() => get('Image').width()
          .then(width => width.should.be.exactly(183)),
          'Item image has the right withd'
        )
        .ok(() => get('Image').height()
          .then(height => height.should.be.exactly(122)),
          'Item image has the right height'
        );

      if ( item.image ) {
        this.ok(() => get('Image').attr('src')
          .then(src => src.should.be.exactly(item.image)),
          'Item Image is the same than in DB'
        );
      }
      else {
        this.ok(() => get('Image').attr('src')
          .then(src => src.should.be.exactly(config.public['default item image'])),
          'Item Image is the default image'
        );
      }
    }

    if ( itemIsAnObject ) {

      // VERIFY TEXT

      this
        .ok(() => get('Truncatable').is(':visible'), 'Item Truncatable space is visible')
        
        .ok(() => get('Subject').is(':visible'), 'Item subject is visible')
        .ok(() => get('Subject').text()
          .then(text => text.should.be.exactly(item.subject)),
          'Subject has the same text than DB')

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
          }),
          'Item Description is the same than in DB'
        )
    
      // BUTTONS

      if ( this.props.buttons !== false ) {
        // PROMOTE
        this
          .ok(() => get('Toggle promote').is(':visible'), 'Promote toggle button is visible')
          .ok(() => get('Toggle promote').text()
            .then(text => (+text).should.be.exactly(item.promotions)),
            'Promote toggle button text is the right amount of times item has been promoted');

        // DETAILS
        this
          .ok(() => get('Toggle details').is(':visible'), 'Details toggle button is visible')
          .ok(() => get('Toggle details').text()
            .then(text => text.should.be.exactly(
              item.popularity.number.toString() + '%')),
            'Deatisl toggle button text is item\'s popularity');

        // RELATED
        this
          .ok(() => get('Related').is(':visible'), 'Related buttons is visible')
          .ok(() => get('Related').text()
            .then(text => (+text).should.be.exactly(item.children)),
            'Related button text is the number of direct children');
      }
    }

    // useDefaultButtons
  }

}

export default Item;
