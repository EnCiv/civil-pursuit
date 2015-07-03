'use strict';

import ItemModel from 'syn/models/item';
import TypeModel from 'syn/models/type';

function getIntro (event) {
  try {
    if ( typeof this.error !== 'function' ) {
      throw new Error('Missing error catcher');
    }

    if ( typeof this.ok !== 'function' ) {
      throw new Error('Missing ok returner');
    }

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
                          try {
                            this.ok(event, intro);
                          }
                          catch ( error ) {
                            this.error.bind(this);
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
        },
        this.error.bind(this)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default getIntro;
