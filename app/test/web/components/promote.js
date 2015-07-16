'use strict';

import Milk             from '../../../lib/app/milk';
import ItemModel        from '../../../models/item';
import VoteModel        from '../../../models/vote';
import FeedbackModel    from '../../../models/feedback';
import cloudinaryFormat from '../../../lib/util/cloudinary-format';
import config           from '../../../../config.json';
import YouTube          from '../../../components/youtube/view';
import DetailsTest      from './details';

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

    // Evaluation -- won't be the same than in Browser since evaluation are random, but like this we get the numbers of items in an evaluation - it should be 6 but it can be less -- also like this we get criterias

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

    set('Left reference', () => find(get('View').selector + ' .left-item.references a'));

    set('Right reference', () => find(get('View').selector + ' .right-item.references a'));

    set('Left criteria', () => find(get('View').selector + ' .left-item.sliders .criteria-name'));

    set('Right criteria', () => find(get('View').selector + ' .right-item.sliders .criteria-name'));

    for ( let i = 0; i < 4 ; i ++ ) {
      set('Left criteria name #' + i, () => find(get('View').selector + ' .left-item.sliders .criteria-' + i + ' .criteria-name'));

      set('Left criteria description #' + i, () => find(get('View').selector + ' .left-item.sliders .criteria-' + i + ' .criteria-description'));

      set('Left criteria slider #' + i, () => find(get('View').selector + ' .left-item.sliders .criteria-' + i + ' input[type="range"]'));
    }

    for ( let i = 0; i < 4 ; i ++ ) {
      set('Right criteria name #' + i, () => find(get('View').selector + ' .right-item.sliders .criteria-' + i + ' .criteria-name'));

      set('Right criteria description #' + i, () => find(get('View').selector + ' .right-item.sliders .criteria-' + i + ' .criteria-description'));

      set('Right criteria slider #' + i, () => find(get('View').selector + ' .right-item.sliders .criteria-' + i + ' input[type="range"]'));
    }

    set('Left feedback', () => find(get('View').selector + ' .left-item.feedback textarea.feedback-entry'));

    set('Left feedback value', 'This a feedback for the left item');

    set('Right feedback', () => find(get('View').selector + ' .right-item.feedback textarea.feedback-entry'));

    set('Right feedback value', 'This a feedback for the right item');

    set('Promote label', () => find(get('View').selector + ' .promote-label-choose'));

    set('Promote left item button', () => find(get('View').selector + ' .left-item .promote'));

    set('Promote right item button', () => find(get('View').selector + ' .right-item .promote'));

    set('Edit and go again left button', () => find(get('View').selector + ' .left-item .edit-and-go-again-toggle'));

    set('Edit and go again right button', () => find(get('View').selector + ' .right-item .edit-and-go-again-toggle'));

    set('Finish button', () => find(get('Main').selector + ' button.finish'));

    set('Last action', 'null');
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
    
    ok(() => get('Limit').text()
      .then(text => 
        (+(text.trim())).should.be.exactly((get('Evaluation').items.length - 1))
      ),
      'Limit shows the right number');

    set('Limit', () => get('Limit').text());

    // SIDE BY SIDE

    ok(() => get('Side by side').is(':visible'), 'Side by side is visible');

    ok(() => get('View').is(':visible'), 'Side by side viewport view is visible');

    for ( let i = 0; i < 4 ; i ++ ) {
      this.cycle(i);
    }

    this.wait(2.5);

    this.import(DetailsTest, () => ({
      item          :   this.item
    }));
  }

  cycle (i) {
    i = i || 0;

    let ok      =   this.ok.bind(this);
    let get     =   this.get.bind(this);
    let set     =   this.set.bind(this);
    let find    =   this.find.bind(this);

    ok(() => new Promise((ok, ko) => {
      console.log();
      console.log();
      console.log();
      console.log('Evaluation cycle, pass #' + i);
      console.log();
      console.log();
      console.log();
      ok();
    }), 'Pass #' + i);

    ok(() => get('Cursor').text()
      .then(text => text.should.be.exactly((i + 1).toString())),
      'Cursor shows the right number',
      () => {
        get('Last action') === 'neither'
      }
    );

    ok(() => get('Cursor').text()
      .then(text => text.should.be.exactly((i).toString())),
      'Cursor shows the right number',
      () => {
        get('Last action') !== 'neither'
      }
    );

    this.wait(2);

    // Get left item's id

    this.leftSide();

    this.rightSide();

    ok(
      () => get('Promote label').is(':visible'),
      'Promote label is visible'
    );

    ok(
      () => get('Promote label').text()
        .then(text => text.trim().should.be.exactly('Which of these is most important for the community to consider?')),
      'Promote label is visible'
    );

    ok(
      () => get('Finish button').is(':visible'),
      'Finish button is visible'
    );

    ok(
      () => get('Finish button').text()
        .then(text => text.should.be.exactly('Neither')),
      'Finish button text is "Neither"'
    );

    ok(
      () => new Promise((ok, ko) => {
        console.log();
        console.log();
        console.log('Promoting left item');
        console.log();
        console.log();
        ok();
      }),
      'Promoting left item',
      () => i === 0
    );

    ok(
      () => get('Promote left item button').click(),
      'Promote left item',
      () => i === 0
    );

    set('Last action', 'promote left item', null, () => i === 0);

    ok(
      () => new Promise((ok, ko) => {
        console.log();
        console.log();
        console.log('Promoting right item');
        console.log();
        console.log();
        ok();
      }),
      'Promoting right item',
      () => i === 1
    );

    ok(
      () => get('Promote right item button').click(),
      'Promote right item',
      () => i === 1
    );

    set('Last action', 'promote right item', null, () => i === 1);

    ok(
      () => new Promise((ok, ko) => {
        console.log();
        console.log();
        console.log('Promoting neither');
        console.log();
        console.log();
        ok();
      }),
      'Promoting neither',
      () => i === 2
    );

    ok(
      () => get('Finish button').click(),
      'Promote neither',
      () => i === 2
    );

    ok(
      () => get('Finish button').text()
        .then(text => text.should.be.exactly('Finish')),
      'Neither button should now show text "Finish"',
      () => i === 3
    );

    ok(
      () => get('Finish button').click(),
      'Promote neither',
      () => i === 3
    );

    set('Last action', 'promote neither', null, () => i === 2);

    this.wait(2);

    this.verifyVotes(i);

    this.verifyFeedback();

    this.verifyPromoted();
  }

  leftSide () {

    let ok      =   this.ok.bind(this);
    let get     =   this.get.bind(this);
    let set     =   this.set.bind(this);
    let find    =   this.find.bind(this);

    // Find item in DB

    set('Left id', () => new Promise((ok, ko) => {
      get('Side by side').attr('data-left-item')
        .then(attr => ok(attr))
    }));

    set('Left votes', () => new Promise((ok, ko) => {
      get('Side by side').attr('data-left-votes')
        .then(attr => {
          console.log('Left votes', get('Left id'), attr);
          ok(attr);
        }, ko)
    }));

    set('Left item', () => new Promise((ok, ko) => {
      ItemModel.findById(get('Left id')).exec().then(
        item => {
          console.log('left item', item);
          ok(item);
        },
        ko
      );
    }));

    // Make sure views have incremented

    set('Left views', () => new Promise((ok, ko) => {
      get('Side by side').attr('data-left-views')
        .then(attr => ok(attr))
    }));

    ok(
      () => new Promise((ok, ko) => {
        +(get('Left item').views).should.be.above(+(get('Left views')));
        ok();
      }),
      'Views of left item should have incremented'
    );

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
            cloudinaryFormat(config.public['default item image'])
          )
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

    // References

    ok(
      () => get('Left reference').text()
        .then(text => text.should.be.exactly(get('Left item').references[0].title)),
      'Left reference has the right title',
      () => get('Left item').references[0] && get('Left item').references[0].title
    );

    ok(
      () => get('Left reference').text()
        .then(text => text.should.be.exactly(get('Left item').references[0].url)),
      'Left reference has the right url but no title',
      () => get('Left item').references[0] && ! get('Left item').references[0].title
    );

    ok(
      () => get('Left reference').attr('href')
        .then(href => {
          try {
            href.should.be.exactly(get('Left item').references[0].url)
          }
          catch ( error ) {
            href.replace(/\/$/, '').should.be.exactly(get('Left item').references[0].url)
          }
        }),
      'Left reference has the right url',
      () => get('Left item').references[0]
    );

    ok(
      () => get('Left reference').attr('target')
        .then(target => target.should.be.exactly('_blank')),
      'Left reference link opens in a new tab',
      () => get('Left item').references[0]
    );

    ok(
      () => get('Left reference').attr('rel')
        .then(rel => rel.should.be.exactly('nofollow')),
      'Left reference link is not indexed by SEO',
      () => get('Left item').references[0]
    );

    // Criterias

    ok(
      () => get('Left criteria').text()
        .then(text => {
          text.should.be.an.Array;
          get('Evaluation').criterias.forEach((criteria, i) => {
            criteria.name.should.be.exactly(text[i]);
          });
        }),
      'Left criterias should be same than DB'
    );

    for ( let i = 0; i < 4 ; i ++ ) {
      ok(
        () => get('Left criteria name #' + i).click(),
        'Click on Criteria #' + i
      );

      this.wait(1);

      ok(
        () => get('Left criteria description #' + i).text()
          .then(text => {
            text.should.be.a.String;
            get('Evaluation').criterias[i].description
              .should.be.exactly(text);
          }),
        'Criteria description is correct #' + i
      );

      // Slider

      ok(
        () => get('Left criteria slider #' + i).is(':visible'),
        'Criteria #' + i + ' has a left slider' 
      );

      ok(
        () => get('Left criteria slider #' + i).val()
          .then(val => (+val).should.be.exactly(0)),
        'Criteria #' + i + ' \'s left slider is 0',
        () => get('Last action') !== 'promote left item'
      );

      if ( i === 0 ) {
        ok(
          () => get('Left criteria slider #' + i).click(),
          'Select criteria #' + i + ' \'s left slider',
          () => get('Last action') !== 'promote left item'
        );

        ok(
          () => get('Left criteria slider #' + i).keys('\u{E012}'),
          'Set criteria #' + i + ' \'s left slider to -1',
          () => get('Last action') !== 'promote left item'
        );

        ok(
          () => get('Left criteria slider #' + i).val()
            .then(val => (+val).should.be.exactly(-1)),
          'Criteria #' + i + ' \'s left slider is -1'
        );
      }

      if ( i === 1 ) {
        ok(
          () => get('Left criteria slider #' + i).click(),
          'Select criteria #' + i + ' \'s left slider',
          () => get('Last action') !== 'promote left item'
        );

        ok(
          () => get('Left criteria slider #' + i).keys('\u{E014}'),
          'Set criteria #' + i + ' \'s left slider to -1',
          () => get('Last action') !== 'promote left item'
        );

        ok(
          () => get('Left criteria slider #' + i).val()
            .then(val => (+val).should.be.exactly(1)),
          'Criteria #' + i + ' \'s left slider is 1'
        );
      }

      if ( i === 2 ) {
        ok(
          () => get('Left criteria slider #' + i).click(),
          'Select criteria #' + i + ' \'s left slider',
          () => get('Last action') !== 'promote left item'
        );

        ok(
          () => get('Left criteria slider #' + i).keys('\u{E014}'),
          'Set criteria #' + i + ' \'s left slider to 1',
          () => get('Last action') !== 'promote left item'
        );

        ok(
          () => get('Left criteria slider #' + i).val()
            .then(val => (+val).should.be.exactly(1)),
          'Criteria #' + i + ' \'s left slider is 1',
          () => get('Last action') !== 'promote left item'
        );

        ok(
          () => get('Left criteria slider #' + i).keys('\u{E012}'),
          'Set criteria #' + i + ' \'s left slider to 0',
          () => get('Last action') !== 'promote left item'
        );

        ok(
          () => get('Left criteria slider #' + i).val()
            .then(val => (+val).should.be.exactly(0)),
          'Criteria #' + i + ' \'s left slider is 0'
        );
      }

      if ( i === 3 ) {
        ok(
          () => get('Left criteria slider #' + i).click(),
          'Select criteria #' + i + ' \'s left slider',
          () => get('Last action') !== 'promote left item'
        );

        ok(
          () => get('Left criteria slider #' + i).keys('\u{E014}'),
          'Set criteria #' + i + ' \'s left slider to 1',
          () => get('Last action') !== 'promote left item'
        );

        ok(
          () => get('Left criteria slider #' + i).val()
            .then(val => (+val).should.be.exactly(1)),
          'Criteria #' + i + ' \'s left slider is 1',
          () => get('Last action') !== 'promote left item'
        );

        ok(
          () => get('Left criteria slider #' + i).keys('\u{E014}'),
          'Set criteria #' + i + ' \'s left slider to 1',
          () => get('Last action') !== 'promote left item'
        );

        ok(
          () => get('Left criteria slider #' + i).val()
            .then(val => (+val).should.be.exactly(1)),
          'Criteria #' + i + ' \'s left slider is 1'
        );
      }
    }

    // Feedback

    ok(
      () => get('Left feedback').is(':visible'),
      'Left feedback is visible'
    );

    ok(
      () => get('Left feedback').val(get('Left feedback value')),
      'Leave a feedback on left item',
      () => get('Last action') !== 'promote left item'
    );

    // Promote item

    ok(
      () => get('Promote left item button').is(':visible'),
      'You can see button to promote left item'
    );

    ok(
      () => get('Promote left item button').text()
        .then(text => text.should.be.exactly(get('Left item').subject)),
      'Left promote button text is item\'s subject'
    );

    // Edit and go again

    ok(
      () => get('Edit and go again left button').is(':visible'),
      'Edit and go again left button is visible'
    );

    ok(
      () => get('Edit and go again left button').text()
        .then(text => text.should.be.exactly('Edit and go again')),
      'Edit and go again left button has the correct text'
    );
  }

  rightSide () {
    let ok      =   this.ok.bind(this);
    let get     =   this.get.bind(this);
    let set     =   this.set.bind(this);
    let find    =   this.find.bind(this);

    set('Right id', () => new Promise((ok, ko) => {
      get('Side by side').attr('data-right-item')
        .then(attr => ok(attr))
    }));

    set('Right votes', () => new Promise((ok, ko) => {
      get('Side by side').attr('data-right-votes')
        .then(attr => {
          console.log('Right votes', get('Right id'), attr);
          ok(attr);
        }, ko)
    }));

    set('Right item', () => ItemModel.findById(get('Right id')).exec());

    set('Right views', () => new Promise((ok, ko) => {
      get('Side by side').attr('data-right-views')
        .then(attr => ok(attr))
    }));

    // Make sure views have incremented

    ok(
      () => new Promise((ok, ko) => {
        +(get('Right item').views).should.be.above(+(get('Right views')));
        ok();
      }),
      'Views of right item should have incremented'
    );

    // Right is different from left

    ok(
      () => new Promise((ok, ko) => {
        try {
          get('Right id').should.not.be.exactly(get('Left id'));
          ok();
        }
        catch (error) {
          ko(error);
        }
      }),
      'Left and right are different'
    );

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
            cloudinaryFormat(config.public['default item image'])
          )
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

    // References

    ok(
      () => get('Right reference').text()
        .then(text => text.should.be.exactly(get('Right item').references[0].title)),
      'Right reference has the right title',
      () => get('Right item').references[0] && get('Right item').references[0].title
    );

    ok(
      () => get('Right reference').text()
        .then(text => text.should.be.exactly(get('Right item').references[0].url)),
      'Right reference has the right url but no title',
      () => get('Right item').references[0] && ! get('Right item').references[0].title
    );

    ok(
      () => get('Right reference').attr('href')
        .then(href => {
          try {
            href.should.be.exactly(get('Right item').references[0].url)
          }
          catch ( error ) {
            href.replace(/\/$/, '').should.be.exactly(get('Right item').references[0].url)
          }
        }),
      'Right reference has the right url',
      () => get('Right item').references[0]
    );

    ok(
      () => get('Right reference').attr('target')
        .then(target => target.should.be.exactly('_blank')),
      'Right reference link opens in a new tab',
      () => get('Right item').references[0]
    );

    ok(
      () => get('Right reference').attr('rel')
        .then(rel => rel.should.be.exactly('nofollow')),
      'Right reference link is not indexed by SEO',
      () => get('Right item').references[0]
    );

    // Criterias

    ok(
      () => get('Right criteria').text()
        .then(text => {
          text.should.be.an.Array;
          get('Evaluation').criterias.forEach((criteria, i) => {
            criteria.name.should.be.exactly(text[i]);
          });
        }),
      'Right criterias should be same than DB'
    );

    for ( let i = 0; i < 4 ; i ++ ) {
      ok(
        () => get('Right criteria name #' + i).click(),
        'Click on Criteria #' + i
      );

      this.wait(1);

      ok(
        () => get('Right criteria description #' + i).text()
          .then(text => {
            text.should.be.a.String;
            get('Evaluation').criterias[i].description
              .should.be.exactly(text);
          }),
        'Criteria description is correct #' + i
      );

      // Slider

      ok(
        () => get('Right criteria slider #' + i).is(':visible'),
        'Criteria #' + i + ' has a right slider' 
      );

      ok(
        () => get('Right criteria slider #' + i).val()
          .then(val => (+val).should.be.exactly(0)),
        'Criteria #' + i + ' \'s right slider is 0',
        () => get('Last action') !== 'promote right item'
      );

      if ( i === 1 ) {
        ok(
          () => get('Right criteria slider #' + i).click(),
          'Select criteria #' + i + ' \'s right slider',
        () => get('Last action') !== 'promote right item'
        );

        ok(
          () => get('Right criteria slider #' + i).keys('\u{E012}'),
          'Set criteria #' + i + ' \'s right slider to -1',
        () => get('Last action') !== 'promote right item'
        );

        ok(
          () => get('Right criteria slider #' + i).val()
            .then(val => (+val).should.be.exactly(-1)),
          'Criteria #' + i + ' \'s right slider is -1'
        );
      }

      if ( i === 3 ) {
        ok(
          () => get('Right criteria slider #' + i).click(),
          'Select criteria #' + i + ' \'s right slider',
        () => get('Last action') !== 'promote right item'
        );

        ok(
          () => get('Right criteria slider #' + i).keys('\u{E014}'),
          'Set criteria #' + i + ' \'s right slider to -1',
        () => get('Last action') !== 'promote right item'
        );

        ok(
          () => get('Right criteria slider #' + i).val()
            .then(val => (+val).should.be.exactly(1)),
          'Criteria #' + i + ' \'s right slider is 1'
        );
      }

      if ( i === 2 ) {
        ok(
          () => get('Right criteria slider #' + i).click(),
          'Select criteria #' + i + ' \'s right slider',
        () => get('Last action') !== 'promote right item'
        );

        ok(
          () => get('Right criteria slider #' + i).keys('\u{E014}'),
          'Set criteria #' + i + ' \'s right slider to 1',
        () => get('Last action') !== 'promote right item'
        );

        ok(
          () => get('Right criteria slider #' + i).val()
            .then(val => (+val).should.be.exactly(1)),
          'Criteria #' + i + ' \'s right slider is 1',
        () => get('Last action') !== 'promote right item'
        );

        ok(
          () => get('Right criteria slider #' + i).keys('\u{E012}'),
          'Set criteria #' + i + ' \'s right slider to 0',
        () => get('Last action') !== 'promote right item'
        );

        ok(
          () => get('Right criteria slider #' + i).val()
            .then(val => (+val).should.be.exactly(0)),
          'Criteria #' + i + ' \'s right slider is 0'
        );
      }

      if ( i === 0 ) {
        ok(
          () => get('Right criteria slider #' + i).click(),
          'Select criteria #' + i + ' \'s right slider',
          () => get('Last action') !== 'promote right item'
        );

        ok(
          () => get('Right criteria slider #' + i).keys('\u{E014}'),
          'Set criteria #' + i + ' \'s right slider to 1',
          () => get('Last action') !== 'promote right item'
        );

        ok(
          () => get('Right criteria slider #' + i).val()
            .then(val => (+val).should.be.exactly(1)),
          'Criteria #' + i + ' \'s right slider is 1',
          () => get('Last action') !== 'promote right item'
        );

        ok(
          () => get('Right criteria slider #' + i).keys('\u{E014}'),
          'Set criteria #' + i + ' \'s right slider to 1',
          () => get('Last action') !== 'promote right item'
        );

        ok(
          () => get('Right criteria slider #' + i).val()
            .then(val => (+val).should.be.exactly(1)),
          'Criteria #' + i + ' \'s right slider is 1'
        );
      }
    }

    // Feedback

    ok(
      () => get('Right feedback').is(':visible'),
      'Right feedback is visible'
    );

    ok(
      () => get('Right feedback').val(get('Right feedback value')),
      'Leave a feedback on right item',
      () => get('Last action') !== 'promote right item'
    );

    // Promote item

    ok(
      () => get('Promote right item button').is(':visible'),
      'You can see button to promote right item'
    );

    ok(
      () => get('Promote right item button').text()
        .then(text => text.should.be.exactly(get('Right item').subject)),
      'Right promote button text is item\'s subject'
    );

    // Edit and go again

    ok(
      () => get('Edit and go again right button').is(':visible'),
      'Edit and go again right button is visible'
    );

    ok(
      () => get('Edit and go again right button').text()
        .then(text => text.should.be.exactly('Edit and go again')),
      'Edit and go again right button has the correct text'
    );
  }

  verifyVotes (i) {
    let ok      =   this.ok.bind(this);
    let get     =   this.get.bind(this);
    let set     =   this.set.bind(this);
    let find    =   this.find.bind(this);

    // Votes should have incremented [LEFT]
    // if last action was anything but Promoting left item

    ok(
      () => new Promise((ok, ko) => {
        let votes = +get('Left votes');
        let where = {
          item    :   get('Left item')._id
        };

        console.log('count', where);

        VoteModel
          .where(where)
          .count((error, count) => {
            if ( error ) {
              return ko(error);
            }
            try {
              count.should.be.exactly(votes + 4);
              ok();
            }
            catch ( error ) {
              ko(error);
            }
          });
      }),
      'Votes should have incremented [LEFT]',
      () => {
        get('Last action') !== 'promote left item'
      }
    );

    // Votes should have the right values [LEFT]
    // if last action was anything but Promoting left item

    ok(
      () => new Promise((ok, ko) => {
        let cookie = JSON.parse(
          decodeURIComponent(get('Cookie').value.replace(/^j%3A/, ''))
        );

        VoteModel
          .find({
            user    :   cookie.id,
            item    :   get('Left item')._id
          })
          .sort({ _id : -1 })
          .limit(4)
          .exec()
          .then(
            votes => {
              try {
                votes.reverse();
                console.log('votes', votes)
                votes[0].value.should.be.exactly(-1);
                votes[1].value.should.be.exactly(1);
                votes[2].value.should.be.exactly(0);
                votes[3].value.should.be.exactly(1);
                ok();
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          )
      }),
      'Verify votes for left item got saved',
      () => {
        get('Last action') !== 'promote left item'
      }
    );

    // Votes should have incremented [RIGHT]

    ok(
      () => new Promise((ok, ko) => {
        let votes = +get('Right votes');
        let where = {
          item    :   get('Right item')._id
        };

        console.log('count', where);

        VoteModel
          .where(where)
          .count((error, count) => {
            if ( error ) {
              return ko(error);
            }
            try {
              count.should.be.exactly(votes + 4);
              ok();
            }
            catch ( error ) {
              ko(error);
            }
          });
      }),
      'Votes should have incremented [RIGHT]',
      () => {
        get('Last action') !== 'promote right item'
      }
    );

    // Votes should have incremented [RIGHT]

    ok(
      () => new Promise((ok, ko) => {
        let cookie = JSON.parse(
          decodeURIComponent(get('Cookie').value.replace(/^j%3A/, ''))
        );

        VoteModel
          .find({
            user    :   cookie.id,
            item    :   get('Right item')._id
          })
          .sort({ _id : -1 })
          .limit(4)
          .exec()
          .then(
            votes => {
              try {
                votes.reverse();
                console.log('votes', votes)
                votes[0].value.should.be.exactly(1);
                votes[1].value.should.be.exactly(-1);
                votes[2].value.should.be.exactly(0);
                votes[3].value.should.be.exactly(1);
                ok();
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          )
      }),
      'Verify votes for right item got saved',
      () => {
        get('Last action') !== 'promote right item'
      }
    );
  }

  verifyFeedback () {
    let ok      =   this.ok.bind(this);
    let get     =   this.get.bind(this);
    let set     =   this.set.bind(this);

    // Left feedback got saved
    // if last action was anything but Promoting left item

    ok(
      () => new Promise((ok, ko) => {
        let cookie = JSON.parse(
          decodeURIComponent(get('Cookie').value.replace(/^j%3A/, ''))
        );

        FeedbackModel
          .findOne({
            item  :   get('Left id'),
            user  :   cookie.id
          })
          .sort({ _id : -1 })
          .exec()
          .then(
            feedback => {
              console.log('got feedback', feedback)
              try {
                feedback.should.be.an.Object;
                feedback.feedback.should.be.exactly(get('Left feedback value'));
                ok();
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
      }),

      'Left feedback got saved',

      () => {
        get('Last action') !== 'promote left item'
      }
    );

    // Right feedback got saved
    // if last action was anything but Promoting right item

    ok(
      () => new Promise((ok, ko) => {
        let cookie = JSON.parse(
          decodeURIComponent(get('Cookie').value.replace(/^j%3A/, ''))
        );

        FeedbackModel
          .findOne({
            item  :   get('Right id'),
            user  :   cookie.id
          })
          .sort({ _id : -1 })
          .exec()
          .then(
            feedback => {
              console.log('got feedback', feedback)
              try {
                feedback.should.be.an.Object;
                feedback.feedback.should.be.exactly(get('Right feedback value'));
                ok();
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
      }),

      'Right feedback got saved',

      () => {
        get('Last action') !== 'promote right item'
      }
    );
  }

  verifyPromoted () {
    let ok      =   this.ok.bind(this);
    let get     =   this.get.bind(this);
    let set     =   this.set.bind(this);

    ok(
      () => new Promise((ok, ko) => {
        ItemModel
          .findById(get('Left id'))
          .exec()
          .then(
            item => {
              if ( ! item ) {
                return ko(new Error('Could not find left item after promoting it'));
              }
              item.promotions.should.be.exactly(get('Left item').promotions + 1);
              ok();
            },
            ko
          );
      }),
      'Left item promotions counter should have incremented by 1 in DB',
      () => get('Last action') === 'promote left item'
    );

    ok(
      () => new Promise((ok, ko) => {
        ItemModel
          .findById(get('Right id'))
          .exec()
          .then(
            item => {
              if ( ! item ) {
                return ko(new Error('Could not find right item after promoting it'));
              }
              item.promotions.should.be.exactly(get('Right item').promotions + 1);
              ok();
            },
            ko
          );
      }),
      'Right item promotions counter should have incremented by 1 in DB',
      () => get('Last action') === 'promote right item'
    );
  }

}

export default Promote;
