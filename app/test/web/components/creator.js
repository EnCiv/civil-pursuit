'use strict';

import fs                   from 'fs';
import request              from 'request';
import config               from '../../../../config.json';
import Milk                 from '../../../lib/app/milk';
import ItemTest             from './item';
import ItemModel            from '../../../models/item';
import getUrlTitle          from '../../../lib/app/get-url-title';

class Creator extends Milk {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {

    props = props || {};

    let options = { viewport : props.viewport, session : props.session };

    super('Creator', options);

    this.props = props || {};

    this.options = options;

    if ( this.props.driver !== false ) {
      this.go('/');
    }

    // If no panel is passed as an argument (for example, creator is called as a stand alone test and not part of testing a panel), then let's click on the first + icon we find in order to reveal the Creator

    if ( ! this.props.panel ) {
      this.props.panel = this.find('.panels > .panel');
      this.wait(2);
      this.ok(() => this.find('.panels > .panel > .panel-heading .toggle-creator')
        .click(), 'Click on Creator Toggle');
      this.wait(2);
    }

    this.actors();

    this.stories();

  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  actors () {

    let find  = this.find.bind(this);
    let get   = this.get.bind(this);
    let set   = this.set.bind(this);

    // Get cookie

    this.set('Cookie', () => this.getCookie('synuser'));

    // ~~~~~~~~~ DOM selectors ~~~~~~~~~ \\

    this.set('Panel', () => this.props.panel);
    
    this.set('Creator', () => find(get('Panel').selector +
      ' > .panel-body > form.creator'));
    
    this.set('Item', () => find(get('Creator').selector +
      ' > .is-section > .item'));

    this.set('Create', () => find(get('Item').selector + ' .button-create'));

    this.set('Subject', () => find(get('Creator').selector + ' input[name="subject"]'));

    this.set('Description', () => find(get('Creator').selector + ' textarea[name="description"]'));

    this.set('Reference', () => find(get('Creator').selector + ' input[name="reference"]'));

    this.set('Reference board', () => find(get('Creator').selector + ' .reference-board'));

    this.set('New item', () => find(get('Panel').selector + ' > .panel-body > .items .item.new'));

    this.set('Input file', () => find(get('Creator').selector + ' input[type="file"][name="image"]'));

    this.set('Choose file', () => find(get('Creator').selector + ' button.upload-image-button'));

    this.set('Uploaded image', () => find(get('Creator').selector + ' .drop-box .preview-image'));
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  stories () {

    let find  = this.find.bind(this);
    let get   = this.get.bind(this);
    let set   = this.set.bind(this);

    // Visibility

    this.ok(() => get('Creator').is(':visible'), 'Creator is visible');
    this.ok(() => get('Creator').is('.is-shown'), 'Creator has class "is-shown", meaning it has been expanded successfully by our navigation system');
    this.ok(() => get('Create').is(':visible'), 'Create button is visible');

    // Form should be empty

    this.ok(() => get('Subject').val()
      .then(val => val.should.be.exactly('')),
      'Subject should be empty');

    // Item

    let options = this.options

    this.import(ItemTest, () => ({
      item          :   get('Item').selector,
      buttons       :   false,
      collapsers    :   false,
      promote       :   false,
      details       :   false,
      references    :   false,
      viewport: options.viewport
    }));

    // Validations

    this.formValidations();

    // Upload

    if ( this.props.upload ) {
      this.set('Test image', () => new Promise((ok, ko) => {
        request(config['example image for test upload'])
          .on('error', ko)
          .on('end', ok)
          .pipe(fs.createWriteStream('/tmp/test-upload.jpg'));
      }));

      // this.ok(() => get('Input file').val('/tmp/test-upload.jpg'));
      this.ok(() => get('Input file').val('/home/francois/Pictures/jpb.jpg'));

      this.wait(3);

      this.ok(() => get('Uploaded image').is(':visible'));

      this.ok(() => get('Uploaded image').attr('src')
        .then(src => src.should.startWith('blob:')));
    }

    // Reference

    this.references();

    // Submit with all required fields

    this.ok(() => get('Create').click(), 'Click on Create button');

    this.wait(.5);

    this.ok(() => get('Subject').not('.error'), 'Subject field is showing error because it is empty');

    this.ok(() => get('Description').not('.error'), 'Description field is showing error because it is empty');

    // New item is an item

    this.wait(2.5);

    this.ok(() => get('New item').is(':visible'), 'Newly created item has appeared on the items list of the panel the creator belongs to');

    this.ok(() => new Promise((ok, ko) => {

      get('New item')
        .attr('id')
        .then(
          id => {
            try {
              if ( Array.isArray(id) ) {
                id = id[0];
              }
              ItemModel
                .findById(id.split('-')[1])
                .exec()
                .then(
                  item => {
                    try {
                      if ( ! item ) {
                        return ko(new Error('New item not found in DB'));
                      }
                      item
                        .toPanelItem()
                        .then(
                          item => {
                            this.Item = item;
                            ok()
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
          },
          ko
        );

    }), 'Get new item from DB');

    this.import(ItemTest, () => ({ item : this.Item, promote : true, viewport: options.viewport }));
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  formValidations () {

    let find  = this.find.bind(this);
    let get   = this.get.bind(this);
    let set   = this.set.bind(this);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    this.ok(() => get('Create').click(),

      'Click on Create button');

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    this.wait(.5);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    this.ok(() => get('Subject').is('.error'),

      'Subject field is showing error because it is empty');

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    this.ok(() => get('Subject').val('This is a subject'),

      'Entering the subject');

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    this.ok(() => get('Create').click(),

      'Click on Create button');

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    this.wait(.5);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    this.ok(() => get('Subject').not('.error'),

      'Subject field is showing error because it is empty');

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    this.ok(() => get('Description').is('.error'),

      'Description field is showing error because it is empty');

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    this.ok(() => get('Description').val('This is a description created ' + new Date()),

      'Entering the description');

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  references (i) {

    let find  = this.find.bind(this);
    let get   = this.get.bind(this);
    let set   = this.set.bind(this);

    i = i || 0;

    let urls = [
      'http://example.com',
      'http://synaccord.com',
      'http://isup.me/http://synaccord.com'
    ];

    let resolveTitle = () => new Promise((ok, ko) => {
      console.log('Getting url', urls[i]);
      getUrlTitle(urls[i])
        .then(
          title => {
            console.log('Got title', title)
            try {
              if ( ! title ) {
                console.log('Could not resolve title of  ' + urls[i]);

                i ++;

                if ( ! urls[i] ) {
                  throw new Error('No more URLS to resolve');
                }

                resolveTitle().then(ok, ko);
              }
              else {
                console.log('Resolved title', title)
                ok(title);
              }
            }
            catch ( error ) {
              ko(error);
            }
          },
          ko
        );
    });

    this.set('Title', () => new Promise((ok, ko) => {
      resolveTitle().then(
        title => {
          console.log('We have title!', title);
          ok(title);
        },
        ko
      );
    }));

    this.ok(() => this.get('Reference').val(urls[i] + '\u{E004}'),
      'Entering URL');

    this.wait(1);

    this.ok(() => this.get('Reference board').is(':visible'),
      'Reference board is visible');

    this.ok(() => this.get('Reference board').text()
      .then(text =>  {
        try {
          text.should.be.exactly('Looking up title');
        } catch (error) {
          text.should.be.exactly(this.get('Title'));
        }
      }),
      'Reference board is showing loading message or response'
    );

    this.wait(5);

    this.ok(() => this.get('Reference board').text()
      .then(text =>  text.should.be.exactly(this.get('Title')) ),
      'Reference board shows title'
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

}

export default Creator;
