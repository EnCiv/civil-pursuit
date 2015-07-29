'use strict';

import { Element, Elements }    from 'cinco/dist';
import config                   from '../../../config.json';

class DemoraphicsView extends Element {

  constructor (props) {
    super('#demographics.section');

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
          src   :   config.profile.demographics.image
        })
      ),
      new Element('h2.profile-section-title').text('Demographics'),
      new Element('.tablet-push-40.gutter').add(
        new Element('.pre-text').text(config.profile.demographics.description)
      )
    );
  }

  toggle () {
    return new Element('.row.toggle-arrow.gutter.text-center').add(
      new Element('i.fa.fa-arrow-down.cursor-pointer')
    );
  }

  body () {
    return new Element('.demographics-collapse.is-container').add(
      new Element('.is-section').add(
        new Element('.row').add(
          
        )
      )
    );
  }

}

export default DemoraphicsView;
