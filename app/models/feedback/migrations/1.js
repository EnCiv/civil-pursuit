'use strict';

import Mungo      from 'mungo';
import Item       from '../../item';
import User       from '../../user';

/** <<<MD
Rename collection
===

Rename collection from "feedbacks" to "feedback".
MD
**/

class Feedback extends Mungo.Migration {

  static do () {
    return new Promise((ok, ko) => {
      Mungo.connections[0].db
        .collection('feedbacks')
        .rename('feedback')
        .then(() => this.revert({ rename : 'feedbacks' }).then(ok, ko))
        .catch(error => {
          if ( error.name !== 'MongoError' ) {
            return ko(error);
          }

          // assuming collection does not exist, so nothing to do, exist
          ok();
        });
    });
  }
}

export default Feedback;
