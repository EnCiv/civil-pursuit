'use strict';

import Milk from 'syn/lib/app/milk';
import ItemTest from './item';

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

  }

}

export default Creator;
