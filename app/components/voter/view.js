'use strict';

import { Element, Elements }    from 'cinco/dist';
import config                   from '../../../config.json';

class VoterView extends Element {

  constructor (props) {
    super('#voter.section');

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
          src   :   config.profile.voter.image
        })
      ),
      new Element('h2.profile-section-title').text('Voter'),
      new Element('.tablet-push-40.gutter').add(
        new Element('.pre-text').text(config.profile.voter.description)
      )
    );
  }

  toggle () {
    return new Element('.row.toggle-arrow.gutter.text-center').add(
      new Element('i.fa.fa-arrow-down.cursor-pointer')
    );
  }

  body () {
    return new Element('.voter-collapse.is-container').add(
      new Element('.is-section').add(
        new Element('.gutter').add(
          new Element('.row').add(
            new Element('button.very.shy.tablet-30').text('Registered voter'),
              new Element('.tablet-70').add(
                new Element('select.is-registered-voter.block.gutter').add(
                  new Element('option', { value : '1' }).text('Yes'),
                  new Element('option', { value : '0' }).text('No')
                )
              )
          ),

          new Element('.row').add(
            new Element('button.very.shy.tablet-30').text('Political Party'),
              new Element('.tablet-70').add(
                new Element('select.party.block.gutter').add(
                  new Element('option', { value : '' }).text('Choose one')
                )
              )
          )
        )
      )
    );
  }
}

export default VoterView;
