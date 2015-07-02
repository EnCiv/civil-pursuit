'use strict';

import ItemModel from 'syn/models/item';
import TypeModel from 'syn/models/type';

function getIntro (event) {
  try {
    TypeModel
      .findOne({ name : 'Intro' })
      .exec()
      .then(
        intro => {
          try {
            if ( ! intro ) {
              return this.error(new Error('Intro type not found'));
            }

            ItemModel
              .findOne({ type : intro._id })
              .exec()
              .then(
                intro => {
                  try {
                    if ( ! intro ) {
                      return this.error(new Error('Intro item not found'));
                    }

                    intro
                      .toPanelItem()
                      .then(
                        intro => {
                          this.ok(event, intro)
                        },
                        this.error.bind(this)
                      );
                  }
                  catch ( error ) {
                    this.error(error);
                  }
                },
                this.error.bind(this)
              );
          }
          catch ( error ) {
            this.error(error);
          }
        },
        this.error.bind(this)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default getIntro;
