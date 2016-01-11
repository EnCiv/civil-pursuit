'use strict';

import Mungo from 'mungo';
import sequencer from 'sequencer';
import fixtures from 'syn/../../fixtures/header-menu/1.json';

class HeaderMenu extends Mungo.Migration {

  static version = 1

  static collection = 'header_menus';

  static schema = {
    title : {
      type : String,
      required : true,
      unique : true
    },
    icon : {
      type : String,
      required : true
    },
    link : {
      type : String,
      required : true
    }
  }

  static do () {
    return sequencer([

      () => this.count(),

      count => new Promise((ok, ko) => {

        if ( count ) {
          return ok();
        }

        sequencer
          ([

            () => this.create(fixtures),

            docs => Promise.all(docs.map(doc =>
              this.revert({ remove : { _id : doc._id } })
            ))

          ])
          .then(ok, ko);

      })

    ]);
  }

}

export default HeaderMenu;
