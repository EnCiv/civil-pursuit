'use strict';

import { Element, Elements }    from 'cinco/dist';
import config                   from '../../../public.json';

class ResidenceView extends Element {

  constructor (props) {
    super('#residence.section');

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
          src   :   config.profile.residence.image
        })
      ),
      new Element('h2.profile-section-title').text('Residence'),
      new Element('.tablet-push-40.gutter').add(
        new Element('.pre-text').text(config.profile.residence.description)
      )
    );
  }

  toggle () {
    return new Element('.row.toggle-arrow.gutter.text-center').add(
      new Element('i.fa.fa-arrow-down.cursor-pointer')
    );
  }

  body () {
    return new Element('.residence-collapse.is-container').add(
      new Element('.is-section').add(
        new Element('.row.gutter-bottom').add(
          new Element('.tablet-50').add(
            new Element('span.not-yet-validated').add(
              new Element('i.fa.fa-exclamation-circle'),
              new Element('span').text(' Not yet validated!')
            ),

            new Element('span.hide.pre.is-validated').add(
              new Element('i.fa.fa-check'),
              new Element('span').text(' Validated'),
              new Element('span.validated-moment')
            )
          ),

          new Element('.tablet-50').add(
            new Element('button.btn.btn-block.validate-gps', { disabled : true }).text('GPS - Validate')
          )
        ),

        new Element('.row').add(
          new Element('input.tablet-40.gutter.city', {
            type          :   'text',
            placeholder   :   'City'
          }),
          new Element('select.tablet-30.gutter.state').add(
            new Element('option', { value : '' }).text('State')
          ),
          new Element('input.tablet-15.gutter.zip', {
            type          :   'text',
            placeholder   :   'ZIP'
          }),
          new Element('input.tablet-15.gutter.zip4', {
            type          :   'text',
            placeholder   :   'ZIP +4'
          })
        )
      )
    );
  }

}

export default ResidenceView;
