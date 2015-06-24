'use strict';

import Milk from 'syn/lib/app/milk';
import ItemModel from 'syn/models/Item';
import cloudinaryFormat from 'syn/lib/util/cloudinary-format';
import config from 'syn/config.json';
import YouTube from 'syn/components/YouTube/View';

class Promote extends Milk {

  constructor (props) {
    props = props || {};

    let options = { viewport : props.viewport };

    super('Promote', options);

    this.props = props;

    this.item = this.props.item;

    this.isYouTube = this.item &&
      this.item.references.length &&
      YouTube.regex.test(this.item.references[0].url);

    if ( this.props.driver !== false ) {
      this.go('/');
    }

    this.actors();
    this.stories();
    
  }

  actors () {

    let set     = this.set.bind(this);
    let get     = this.get.bind(this);
    let find    = this.find.bind(this);

    // Item View

    set('Item', () => find('#item-' + this.item._id));

    // Cookie

    set('Cookie', () => this.getCookie('synuser'));

    // Evaluation -- won't be the same than in Browser since evaluation are random, but like this we get the numbers of items in an evaluation - it should be 6 but it can be less

    set('Evaluation', () => ItemModel.evaluate(get('Cookie').id, this.item._id));
    
    set('Main', () => find(get('Item').selector + ' > .item-collapsers > .promote'));

    set('Header', () => find(get('Main').selector + ' header.promote-steps'));

    set('Cursor', () => find(get('Header').selector + ' .cursor'));
    
    set('Limit', () => find(get('Header').selector + ' .limit'));

    set('Side by side', () => find(get('Main').selector + ' .items-side-by-side'));

    // VIEWPORT VIEW

    switch ( this.props.viewport ) {
      case 'tablet':
        set('View', () => find(get('Side by side').selector + ' .split-hide-down'));
        break;
    }

    set('Left image', () => find(get('View').selector + ' .left-item.image img.img-responsive'));

    set('Right image', () => find(get('View').selector + ' .right-item.image img.img-responsive'));

    set('Left video', () => find(get('View').selector + ' .left-item.image .video-container iframe'));

    set('Right video', () => find(get('View').selector + ' .right-item.image .video-container iframe'));

    set('Left subject', () => find(get('View').selector + ' .left-item.subject h4'));

    set('Right subject', () => find(get('View').selector + ' .right-item.subject h4'));

    set('Left description', () => find(get('View').selector + ' .left-item.description'));

    set('Right description', () => find(get('View').selector + ' .right-item.description'));
  }

  stories () {
    let ok      =   this.ok.bind(this);
    let get     =   this.get.bind(this);
    let set     =   this.set.bind(this);
    let find    =   this.find.bind(this);

    ok(() => get('Item').is(':visible'), 'Item is visible');
    ok(() => get('Main').is(':visible'), 'Promote is visible');
    ok(() => get('Header').is(':visible'), 'Header is visible');
    ok(() => get('Cursor').is(':visible'), 'Cursor is visible');

    ok(() => get('Cursor').text()
      .then(text => text.should.be.exactly('1')),
      'Cursor shows the right number');
    
    ok(() => get('Limit').text()
      .then(text => 
        (+(text.trim())).should.be.exactly((get('Evaluation').items.length - 1))
      ),
      'Limit shows the right number');

    set('Limit', () => get('Limit').text());

    // SIDE BY SIDE

    ok(() => get('Side by side').is(':visible'), 'Side by side is visible');

    ok(() => get('View').is(':visible'), 'Side by side viewport view is visible');

    // Get left item's id

    ok(
      () => get('Side by side').attr('data-left-item')
        .then(attr => this.leftSide(attr)),
      'Verify left item'
    );

    ok(
      () => get('Side by side').attr('data-right-item')
        .then(attr => this.rightSide(attr)),
      'Verify right item'
    );
  }

  leftSide (id) {
    console.log('left side', id)
    let ok      =   this.ok.bind(this);
    let get     =   this.get.bind(this);
    let set     =   this.set.bind(this);
    let find    =   this.find.bind(this);

    set('Left item', () => ItemModel.findById(id).exec());

    // Left image is item's image

    ok(
      () => get('Left image').attr('src')
        .then(src => src.should.be.exactly(
          cloudinaryFormat(get('Left item').image)
        )),
      'Left image',
      () => get('Left item').image && ! YouTube.isYouTube(get('Left item'))
    );

    // Left image is default image

    ok(
      () => get('Left image').attr('src')
        .then(src => src.should.be.exactly(
          config.public['default item image'])
        ),
      'Left image is default image',
      () => ! get('Left item').image && !YouTube.isYouTube(get('Left item')));

    // YouTube

    ok(
      () => get('Left video').is(':visible'),
      'Left image is a YouTube video',
      () => YouTube.isYouTube(get('Left item'))
    );

    ok(
      () => get('Left video').attr('src')
        .then(src => {
          let v = YouTube.getId(get('Left item').references[0].url);
          src.should.be.exactly('http://www.youtube.com/embed/' + v +
            '?autoplay=0');
        }),
      'Left YouTube video is the same link than in DB',
      () => YouTube.isYouTube(get('Left item'))
    );

    // Subject

    ok(
      () => get('Left subject').text()
        .then(text => text.should.be.exactly(get('Left item').subject)),
      'Left subject is same than DB'
    );

    // Description

    ok(
      () => get('Left description').text()
        .then(text => text.should.be.exactly(Milk.formatToHTMLText(get('Left item').description))),
      'Left description is same than DB'
    );
  }

  rightSide (id) {
    console.log('right side', id)
    let ok      =   this.ok.bind(this);
    let get     =   this.get.bind(this);
    let set     =   this.set.bind(this);
    let find    =   this.find.bind(this);

    set('Right item', () => ItemModel.findById(id).exec());

    // Has image

    ok(
      () => get('Right image').attr('src')
        .then(src => src.should.be.exactly(
          cloudinaryFormat(get('Right item').image)
        )),
      'Right image',
      () => get('Right item').image && ! YouTube.isYouTube(get('Right item'))
    );

    // Default image

     ok(
      () => get('Right image').attr('src')
        .then(src => src.should.be.exactly(
          config.public['default item image'])
        ),
      'Right image is default image',
      () => ! get('Right item').image && !YouTube.isYouTube(get('Right item')));

    // YouTube

    ok(
      () => get('Right video').is(':visible'),
      'Right image is a YouTube video',
      () => YouTube.isYouTube(get('Right item'))
    );

    ok(
      () => get('Right video').attr('src')
        .then(src => {
          let v = YouTube.getId(get('Right item').references[0].url);
          src.should.be.exactly('http://www.youtube.com/embed/' + v +
            '?autoplay=0');
        }),
      'Right YouTube video is the same link than in DB',
      () => YouTube.isYouTube(get('Right item'))
    );

    // Subject

    ok(
      () => get('Right subject').text()
        .then(text => text.should.be.exactly(get('Right item').subject)),
      'Right subject is same than DB'
    );

    // Description

    ok(
      () => get('Right description').text()
        .then(text => text.should.be.exactly(Milk.formatToHTMLText(get('Right item').description))),
      'Right description is same than DB'
    );
  }

}

export default Promote;
