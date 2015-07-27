'use strict';

import { Element, Elements }    from 'cinco/dist';
import config                   from '../../../config.json';

class IdentityView extends Element {

  constructor (props, extra) {
    super('#identity.section.center');

    this.add(
      new Elements(
        this.header(),
        this.body(),
        this.toggle()
      )
    );
  }

  header () {
    return new Element('.gutter').add(
      new Element('.tablet-40.user-image-container').add(
        new Element('img.img-responsive.user-image.radius', {
          src   :   config.public['user image']
        })
      ),
      new Element('h2.profile-section-title').text('Identity'),
      new Element('.tablet-push-40.gutter').add(
        new Element('.pre-text').text(config.profile.identity.description)
      )
    );
  }

  body () {
    return new Element('.identity-collapse.is-container.row').add(
      new Element('.is-section').add(
        new Element('.row.gutter').add(
          this.avatar(),
          this.civility(),
          this.citizenship(),
          this.dob(),
          this.gender()
        )
      )
    );
  }

  avatar () {
    return new Element('p.image-buttons.row').add(
      new Element('button.block.upload-image').text('Upload Image'),
      new Element('input.upload-identity-picture.hide', {
        type  :   'file'
      })
    );
  }

  civility () {
    return new Element('.names.input-group-tablet.gutter-right.gutter-bottom').add(
      new Element('input.watch-100.tablet-40', {
        type          :   'text',
        placeholder   :   'First name',
        name          :   'first-name'
      }),

      new Element('input.watch-100.tablet-20', {
        type          :   'text',
        placeholder   :   'Middle name',
        name          :   'middle-name'
      }),

      new Element('input.watch-100.tablet-40', {
        type          :   'text',
        placeholder   :   'Last name',
        name          :   'last-name'
      })
    );
  }

  toggle () {
    return new Element('.row.toggle-arrow.gutter.text-center').add(
      new Element('i.fa.fa-arrow-down.cursor-pointer')
    );
  }

  citizenship () {
    return new Elements(
      new Element('.row.gutter-top').add(
        new Element('button.very.shy.tablet-30').text('Citizenship'),
        new Element('.tablet-70').add(
          new Element('select.citizenship.block.gutter').add(
            new Element('option', { value : '' }).text('Choose one')
          )
        )
      ),
      new Element('.row').add(
        new Element('button.very.shy.tablet-30').text('Dual citizenship'),
        new Element('.tablet-70').add(
          new Element('select.citizenship.block.gutter').add(
            new Element('option', { value : '' }).text('None')
          )
        )
      )
    );
  }

  dob () {
    return new Element('.row').add(
      new Element('button.very.shy.tablet-30').text('Birthdate'),
      new Element('.tablet-70').add(
        new Element('input.block.gutter.dob', { type : 'date' })
      )
    );
  }

  gender () {
    return new Element('.row').add(
      new Element('button.very.shy.tablet-30').text('Gender'),
      new Element('.tablet-70').add(
          new Element('select.gender.block.gutter').add(
            new Element('option', { value : 'M' }).text('Male'),
            new Element('option', { value : 'F' }).text('Female'),
            new Element('option', { value : 'O' }).text('Other')
          )
        )
    );
  }

}

export default IdentityView;
