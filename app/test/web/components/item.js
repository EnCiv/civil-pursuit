'use strict';

import Milk                 from '../../../lib/app/milk';
import YouTubeView          from '../../../components/youtube/view';
import config               from '../../../../config.json';
import JoinTest             from './join';
import PromoteTest          from './promote';
import DetailsTest          from './details';
import cloudinaryFormat     from '../../../lib/util/cloudinary-format';
import ItemModel            from '../../../models/item';

class Item extends Milk {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {

    props = props || {};

    let options = { viewport : props.viewport };

    super('Item', options);

    console.log('props', props);

    this.props            =   props;
    this.options          =   options;

    if ( this.props.driver !== false ) {
      this.go('/');
    }

    this.actors();

    this.stories();

  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  actors () {

    this
      .set('Join',      () => this.find(JoinTest.find('main')))
      
      .set('Cookie',    () => this.getCookie('synuser'))
      
      .set('View',      () => this.find(this.props.item.selector), null,
        () => this.props.item.selector)
      
      .set('View',      () => this.find('#item-' + this.props.item.document._id), null,
        () => this.props.item.document)

      .set('Document', this.props.item.document, null,
        () => this.props.item.document)
      
      .set('Document',  this.getDocumentFromId.bind(this), null,
        () => ! this.props.item.document)

      .set('Media Wrapper', () => this.find(
        this.get('View').selector + '>.item-media-wrapper'
      ))

      .set('Media', () => this.find(
        this.get('Media Wrapper').selector + '>.item-media'
      ))
      
      .set('Image', () => this.find(
        this.get('Media').selector + ' img.img-responsive'
      ))
      
      .set('Video Container', () => this.find(
        this.get('Media Wrapper').selector + ' .video-container'
      ))
      
      .set('Iframe', () => this.find(
        this.get('Video Container').selector + ' iframe'
      ))

      .set('Buttons', () => this.find(
        this.get('View').selector + '>.item-buttons'
      ))

      .set('Text', () => this.find(
        this.get('View').selector + '>.item-text'
      ))

      .set('Truncatable', () => this.find(
        this.get('Text').selector + '>.item-truncatable'
      ))

      .set('Subject', () => this.find(
        this.get('Text').selector + ' h4.item-subject.header'
      ))

      .set('Description', () => this.find(
        this.get('Text').selector + ' .item-description.pre-text'
      ))

      .set('Reference', () => this.find(
        this.get('Text').selector + ' .item-reference a'
      ))

      .set('Toggle promote', () => this.find(
        this.get('Buttons').selector + ' button.item-toggle-promote'
      ))

      .set('Toggle details', () => this.find(
        this.get('Buttons').selector + ' .item-toggle-details'
      ))

      .set('Related', () => this.find(
        this.get('Buttons').selector + ' span.related-number'
      ))

      .set('Harmony', () => this.find(
        this.get('Buttons').selector + ' span.harmony-number'
      ))

      .set('Collapsers', () => this.find(
        this.get('View').selector + '>.item-collapsers'
      ))

      .set('Collapse arrow', () => this.find(
        this.get('View').selector + '>.item-arrow i.fa'
      ))

      .set('Children', () => this.find(
        this.get('Collapsers').selector + '>.children'
      ))

      .set(
        'Child Panel Harmony Left',

        () => {

          let selector = this.get('Children').selector;

          selector += ' .tablet-50.left-split .panel.split-view#panel-';

          selector += this.get('Document').type.harmony[0]._id + '-';

          selector += this.get('Document')._id;

          return this.find(selector);

        },

        'Child Panel Harmony Left',

        () => this.get('Document') && this.get('Document').type.harmony[0]
      );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  stories () {
    // Visibility

    this

      .ok(() => this.get('View').is(':visible'),
        'Item is visible')
      
      .ok(() => this.get('View').is('.item'),
        'Item has the class ".visible"')
      
      .ok(() => this.get('Media Wrapper').is(':visible'),
        'Item Media Wrapper is visible')

      .ok(() => this.get('Media').is(':visible'),
        'Item Media is visible')

      .ok(() => this.get('Text').is(':visible'),
        'Item Text is visible');

    // Media

    this.media();

    // VERIFY TEXT

    this.text();

    // BUTTONS

    this.buttons();

    // COLLAPSERS

    this.collapsers();

    // PROMOTE

    this.promote();

    // DETAILS

    this.details();
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  media () {
    this.youTube();

    this.image();
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  youTube () {

    let condition = () => this.get('Document') &&
      YouTubeView.isYouTube(this.get('Document'));

    this
      .ok(
        () => this.get('Video Container').is(':visible'),
        'Item Video Container is visible',
        condition
      )

      .wait(1, null, condition)
      
      .ok(
        () => this.get('Iframe').is(':visible'),
        'Item YouTube Iframe is visible',
        condition
      )
      
      .ok(() => this.get('Iframe').width()
        .then(width => width.should.be.within(183, 186)),
        'Iframe should be the exact width',
        condition
      )
      
      .ok(() => this.get('Iframe').height()
        .then(height => height.should.be.within(133, 135)),
        'Iframe should be the exact height',
        condition
      );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  image () {

    let condition = () => this.get('Document') &&
      ! YouTubeView.isYouTube(this.get('Document'));

    let conditionHasImage = () => this.get('Document') &&
      ! YouTubeView.isYouTube(this.get('Document')) &&
      this.get('Document').image;

    let conditionDoesNotHaveImage = () => this.get('Document') &&
      ! YouTubeView.isYouTube(this.get('Document')) &&
      ! this.get('Document').image;

    this
      .ok(
        () => this.get('Image').is(':visible'),
        'Item Image is visible',
        condition
      )
      
      .ok(
        () => this.get('Image').width()
          .then(width => width.should.be.within(183, 186)),
        'Item image has the right width',
        condition
      )
      
      .ok(
        () => this.get('Image').height()
          .then(height => height.should.be.within(100, 150)),
        'Item image has the right height',
        condition
      )

      .ok(
        () => this.get('Image').attr('src')
          .then(src => src.should.be.exactly(cloudinaryFormat(this.get('Document').image))),
        'Item Image is the same than in DB',
        conditionHasImage
      )

      .ok(
        () => this.get('Image').attr('src')
          .then(src => src.should.be.exactly(config.public['default item image'])),
        'Item Image is the default image',
        conditionDoesNotHaveImage
      );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  text () {
    this
      .ok(() => this.get('Truncatable').is(':visible'), 'Item Truncatable space is visible')
      
      .ok(() => this.get('Subject').is(':visible'), 'Item subject is visible')
      
      .ok(() => this.get('Subject').text()
        .then(text => text.should.be.exactly(this.get('Document').subject)),
        'Subject has the same text than DB')

      
      .ok(() => 
        Promise.all([
          this.get('Truncatable').count('.more'),
          this.get('Description').text()
        ])
        .then(results => {
          let more = results[0];
          let text = results[1];
          
          if ( ! more ) {
            text.should.be.exactly(Milk.formatToHTMLText(this.get('Document').description));
          }
        }),
        'Item Description is the same than in DB'
      );

    // REFERENCES

    this.ok(() => this.get('Reference').text()
      .then(text => {
        let ref = this.get('Document').references.length ? this.get('Document').references[0] : null;

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
      }), 'Verify reference',
      () => this.props.references !== false);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  buttons () {
    if ( this.props.buttons !== false ) {
      this.ok(() => this.get('Buttons').is(':visible'),
        'Item Buttons are visible')

      // PROMOTE
      this
        .ok(() => this.get('Toggle promote').is(':visible'), 'Promote toggle button is visible')
        .ok(() => this.get('Toggle promote').text()
          .then(text => (+text).should.be.exactly(this.get('Document').promotions)),
          'Promote toggle button text is the right amount of times item has been promoted');

      // DETAILS
      this
        .ok(() => this.get('Toggle details').is(':visible'), 'Details toggle button is visible')
        .ok(() => this.get('Toggle details').text()
          .then(text => text.should.be.exactly(
            this.get('Document').popularity.number.toString() + '%')),
          'Deatisl toggle button text is item\'s popularity');

      // RELATED
      this
        .ok(() => this.get('Related').is(':visible'), 'Related buttons is visible')
        .ok(() => this.get('Related').text()
          .then(text => {
            (+text).should.be.exactly(this.get('Document').children)
          }),
          'Related button text is the number of direct children');

      // HARMONY
      this
        .ok(() => this.get('Harmony').is(':visible'), 'Harmony buttons is visible')
        .ok(() => this.get('Harmony').text()
          .then(text => {
            (+text).should.be.exactly(this.get('Document').harmony)
          }),
          'Harmony button text is the number of direct children');
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  collapsers () {
    if ( this.props.collapsers === false ) {
      return false;
    }

    this
      
      .ok(() => this.get('Collapsers').is(true),
        'Collapsers are hidden')
      
      .ok(() => this.get('Collapse arrow').is(':visible'),
        'Collapse arrow is visible')

      .ok(() => this.get('Collapse arrow').click(),
        'Collapse arrow is clickable')

      .wait(2)

      .ok(() => this.get('Children').is(':visible'),
        'Children panels are visible')

      .ok(
        () => this.get('Child Panel Harmony Left').is(':visible'),
        'Left harmony children panel is visible',
        () => this.get('Document').type.harmony.length
      );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  promote () {
    if ( this.props.promote !== false ) {

      // NO COOKIE

      this
        .ok(() => this.get('Toggle promote').click(), 'Clicking on Promote toggle buttons should show Join', when => ! this.get('Cookie'))
        .wait(1, null, when => ! this.get('Cookie'))
        .ok(() => this.get('Join').is(true), null, when => ! this.get('Cookie'))

        .ok(() => this.get('Toggle promote').click(), 'Clicking on Promote toggle buttons should show Join', when => ! this.get('Cookie'))
        .wait(2, null, when => ! this.get('Cookie'))
        .ok(() => this.get('Join').is(false), null, when => ! this.get('Cookie'));

      // COOKIE

      // Don't click because components like Creator have already shown Promote when new item was created
      if ( this.props.promote !== true ) {
        this
          .ok(() => this.get('Toggle promote').click(), 'Clicking on Promote toggle buttons should show Promote', when => this.get('Cookie'))
      }

      this
        .wait(1, null, when => this.get('Cookie'))

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        
        .import(PromoteTest,
          {
            item        :   this.get('Document'), 
            viewport    :   this.options.viewport
          },
          
          'Launch Promote test if User is signed in',
          
          when => this.get('Cookie'))

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        
        .ok(
          () => this.get('Toggle promote').click(),

          'Clicking on Promote toggle buttons should show Promote (if User is signed in)',

          when => this.get('Cookie'))

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        
        .wait(
          2,

          'Wait 2 seconds for Promote screen to hide (if User is signed in)', 

          when => this.get('Cookie')
        );

    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  details () {
    if ( this.props.details !== false ) {

      this
        .ok(() => this.get('Toggle details').click(),
          'Clicking on Details toggle buttons')

        .wait(2)

        .import(DetailsTest, { item : this.get('Document'), viewport : this.options.viewport })

        .ok(() => this.get('Toggle details').click(),
          'Clicking on Details toggle button')

        .wait(1);

    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  getDocumentFromId () {
    return new Promise((ok, ko) => {
      try {
        this
          .get('View')
          .attr('id')
          .then(
            id => {
              try {
                let itemId = id.split('-')[1];

                if ( itemId === 'undefined' ) {
                  return ok(null);
                }

                ItemModel
                  .findById(itemId)
                  .exec()
                  .then(
                    item => {
                      try {
                        if ( ! item ) {
                          throw new Error('Item not found: ' + itemId);
                        }
                        ok(item);
                      }
                      catch ( error ) {
                        ko(error);
                      }
                    },
                    ko
                  );
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
      }
      catch ( error ) {
        ko(error);
      }
    })
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

}

export default Item;
