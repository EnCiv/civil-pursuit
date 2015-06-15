'use strict';

import Milk from 'syn/lib/app/milk';
import YouTubeView from 'syn/components/YouTube/View';
import config from 'syn/config.json';
import JoinTest from './join';
import PromoteTest from './promote';

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

    this.set('Join', () => this.find(JoinTest.find('main')));

    this
      
      .set('Cookie', () => this.getCookie('synuser'));

    if ( props.element ) {
      this.set('Item', () => props.element, null, props.element);
    }

    else {
      this
        .set('Item', () => find('#item-' + item._id), null, () => itemIsAnObject)

        .set('Item', () => find(item), null, () => itemIsASelector);
    }
      
    this
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

      .set('Reference', () => this.find(
        get('Text').selector + ' .item-reference a'
      ))

      .set('Toggle promote', () => this.find(
        get('Buttons').selector + ' button.item-toggle-promote'
      ))

      .set('Toggle details', () => this.find(
        get('Buttons').selector + ' .item-toggle-details'
      ))

      .set('Related', () => this.find(
        get('Buttons').selector + ' span.related'
      ))

      .set('Collapsers', () => this.find(
        get('Item').selector + '>.item-collapsers'
      ));

    // Visibility

    this

      .ok(() => get('Item').is(':visible'),
        'Item is visible')
      
      .ok(() => get('Item').is('.item'),
        'Item has the class ".visible"')
      
      .ok(() => get('Media Wrapper').is(':visible'),
        'Item Media Wrapper is visible')

      .ok(() => get('Media').is(':visible'),
        'Item Media is visible')

      .ok(() => get('Text').is(':visible'),
        'Item Text is visible');

    if ( itemIsAnObject && YouTubeView.isYouTube(item) ) {
      this
        .ok(() => get('Video Container').is(':visible'), 'Item Video Container is visible')
        .wait(1)
        .ok(() => get('Iframe').is(':visible'), 'Item YouTube Iframe is visible')
        .ok(() => get('Iframe').width()
          .then(width => width.should.be.within(183, 186)),
          'Iframe should be the exact width'
        )
        .ok(() => get('Iframe').height()
          .then(height => height.should.be.within(133, 135)),
          'Iframe should be the exact height'
        );
    }

    else if ( itemIsAnObject ) {
      this
        .ok(() => get('Image').is(':visible'), 'Item Image is visible')
        .ok(() => get('Image').width()
          .then(width => width.should.be.within(183, 186)),
          'Item image has the right withd'
        )
        .ok(() => get('Image').height()
          .then(height => height.should.be.within(122, 125)),
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
            get('Truncatable').count('.more'),
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
        );

      // REFERENCES

      this.ok(() => get('Reference').text()
        .then(text => {
          if ( itemIsAnObject ) {
            let ref = item.references.length ? item.references[0] : null;

            if ( ref ) {
              if ( ref.title ) {
                text.should.be.exactly(ref.title);
              }
              else {
                text.should.be.exactly(ref.url);
              }
            }
            else {
              text.should.be.exactly('');
            }
          }
        }), 'Verify reference',
        () => props.references !== false)
    
      // BUTTONS

      if ( props.buttons !== false ) {
        this.ok(() => get('Buttons').is(':visible'),
          'Item Buttons are visible')

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

    // COLLAPSERS

    if ( this.props.collapsers !== false && item.collapsers !== false ) {
      this.ok(() => get('Collapsers').is(true), 'Collapsers are hidden');
    }

    // PROMOTE

    if ( this.props.promote !== false && item.promote !== false ) {

      // NO COOKIE

      this
        .ok(() => get('Toggle promote').click(), 'Clicking on Promote toggle buttons should show Join', when => ! get('Cookie'))
        .wait(1, null, when => ! get('Cookie'))
        .ok(() => get('Join').is(true), null, when => ! get('Cookie'))

        .ok(() => get('Toggle promote').click(), 'Clicking on Promote toggle buttons should show Join', when => ! get('Cookie'))
        .wait(1, null, when => ! get('Cookie'))
        .ok(() => get('Join').is(false), null, when => ! get('Cookie'));

      // COOKIE

      // Don't click because components like Creator have already shown Promote when new item was created
      if ( this.props.promote !== true ) {
        this
          .ok(() => get('Toggle promote').click(), 'Clicking on Promote toggle buttons should show Promote', when => get('Cookie'))
      }

      this
        .wait(1, null, when => get('Cookie'))
        .import(PromoteTest, { item : item }, null, when => get('Cookie'))
        .ok(() => get('Toggle promote').click(), 'Clicking on Promote toggle buttons should show Promote', when => get('Cookie'))
        .wait(1, null, when => get('Cookie'));

    }

  }

}

export default Item;
