'use strict';

import should from 'should';
import Describe from 'syn/lib/app/Describe';
import config from 'syn/config.json';
import Type from 'syn/models/Type';
import Item from 'syn/models/Item';

class Intro extends Describe {

  constructor () {
    super('Intro', {
      'web driver'    :   {
        'page'        :   'Home'
      }
    });

    this

      .before(
        'Get intro from DB',
        () => Type
          .findOne({ name: 'Intro' })
          .exec()
          .then(type => {
            this.define('Type', type);

            Item
              .findOne({ type: type._id })
              .exec()
              .then(item => this.define('Item', item))
          })
      )

      .assert(
        'Intro should be visible',
        { visible: '#intro' }
      )

      .assert(
        'Intro subject should be the same one than from DB',
        { text: '#intro .panel-title' },
        subject =>
          { subject.should.be.exactly(this._definitions.Item.subject) }
      );
  }

}

export default Intro;
