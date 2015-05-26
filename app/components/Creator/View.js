'use strict';

import {Element, Elements}   from 'cinco/es5';
import ItemView  from 'syn/components/Item/View';

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//  Creator
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Creator extends Element {
  
  constructor (props) {
    super('form.creator.is-container', {
      name                :     'create',
      novalidate          :     'novalidate',
      role                :     'form',
      method              :     'POST'
    })
    
    this.props = props
    
    var itemBox = this.itemBox();
    
    itemBox
      .find('.item-text')
      .get(0)
      .empty()
      .add(this.inputs());
    
    this.add(
      new Element('.is-section').add(
        itemBox
      )
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Drag and drop (modern browsers only)
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  modern () {
    return new Element('.modern').add(
      new Element('h4').text('Drop image here'),
      new Element('p').text('or')
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Legacy input type file (masked by a button for design purposes)
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  legacy () { 
    return new Element('.phasing').add(
      new Element('button.upload-image-button', { type: 'button' })
        .text('Choose a file'),

      new Element('input.hide', {
        type                :     'file', 
        value               :     'Upload image',
      })
        .close()
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Image uploader container
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  dropBox () {
    return new Element('.drop-box').add(
      this.modern(),
      this.legacy());
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Submit button
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  submitButton () { 
    return new Element('button.button-create.shy.medium').add(
      new Element('i.fa.fa-bullhorn')
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Item Component
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  itemBox () {
    return new ItemView({
      item                :     {
        media             :     this.dropBox(),
        buttons           :     new Elements(this.submitButton()),
        collapsers        :     false
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Text inputs
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  inputs () { 
    return new Element('.item-inputs').add(
      this.subject(),
      this.description()
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Subject field
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  subject () { 
    return new Element('input', {
      type                :     'text',
      placeholder         :     'Item subject',
      required            :     'required',
      name                :     'subject',
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Description field
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  description () {
    return new Element('textarea', {
      placeholder         :     'Item description',
      required            :     'required',
      name                :     'description'
    });
  }

}

export default Creator;
