'use strict';

import Milk from 'syn/lib/app/milk';
import ItemTest from './item';
import ItemModel from 'syn/models/Item';

class Creator extends Milk {

  constructor (props) {

    props = props || {};

    let options = { viewport : props.viewport };

    super('Creator', options);

    this.props = props || {};

    let get = this.get.bind(this);
    let find = this.find.bind(this);

    if ( this.props.driver !== false ) {
      this.go('/');
    }

    let Item;

    // Get cookie

    this.set('Cookie', () => this.getCookie('synuser'));

    // DOM selectors

    this.set('Panel', () => this.props.panel);
    
    this.set('Creator', () => find(get('Panel').selector +
      ' > .panel-body > form.creator'));
    
    this.set('Item', () => find(get('Creator').selector +
      ' > .is-section > .item'));

    this.set('Create', () => find(get('Item').selector + ' .button-create'));

    this.set('Subject', () => find(get('Creator').selector + ' input[name="subject"]'));

    this.set('Description', () => find(get('Creator').selector + ' textarea[name="description"]'));

    this.set('New item', () => find(get('Panel').selector + ' > .panel-body > .items .item.new'));

    // Visibility

    this.ok(() => get('Creator').is(':visible'), 'Creator is visible');
    this.ok(() => get('Creator').is('.is-shown'), 'Creator has class "is-shown", meaning it has been expanded successfully by our navigation system');
    this.ok(() => get('Create').is(':visible'), 'Create button is visible');

    // Item

    this.import(ItemTest, () => (
      { item : get('Item').selector, buttons: false }));

    // Validations

    this.ok(() => get('Create').click(), 'Click on Create button');

    this.ok(() => get('Subject').is('.error'), 'Subject field is showing error because it is empty');

    this.ok(() => get('Subject').val('This is a subject'), 'Writing a subject');

    this.ok(() => get('Create').click(), 'Click on Create button');

    this.ok(() => get('Subject').not('.error'), 'Subject field is showing error because it is empty');

    this.ok(() => get('Description').is('.error'), 'Description field is showing error because it is empty');

    this.ok(() => get('Description').val('This is a description'), 'Writing a description');

    this.ok(() => get('Create').click(), 'Click on Create button');

    this.ok(() => get('Subject').not('.error'), 'Subject field is showing error because it is empty');

    this.ok(() => get('Description').not('.error'), 'Description field is showing error because it is empty');

    // New item is an item

    this.wait(2.5);

    this.ok(() => get('New item').is(':visible'), 'Newly created item has appeared on the items list of the panel the creator belongs to');

    this.ok(() => new Promise((ok, ko) => {

      console.log('will now fetch db')

      get('New item')
        .attr('id')
        .then(
          id => {
            ItemModel
              .findById(id.split('-')[1])
              .exec()
              .then(
                item => {
                  console.log('got response', item)
                  if ( ! item ) {
                    return ko(new Error('New item not found in DB'));
                  }
                  item.toPanelItem((error, item) => {
                    if ( error ) {
                      return ko(error);
                    }
                    Item = item;
                    ok();
                  });
                },
                ko
              );
          },
          ko
        );

    }), 'Get new item from DB');

    this.import(ItemTest, () => ({ item : Item }));

  }

}

export default Creator;
