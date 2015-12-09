'use strict';

import describe                   from 'redtea';
import Item                       from '../../models/item';
import isPopularity               from './is-popularity';
import isObjectID                 from './is-object-id';

function isPanelItem (panelItem, item = {}, serialized = false) {

  const locals = {};

  return it => {
    it(serialized ? 'should be serialized' : 'should not be serialized', ok => ok());

    it('_id', describe.use(() => isObjectID(panelItem._id, item._id, serialized)));

    it('should get item', (ok, ko) => {
      Item.findById(panelItem._id).then(
        item => {
          locals.item = item;
          if ( ! item ) {
            return ko(new Error(`No such item ${panelItem._id}`));
          }
          ok();
        },
        ko
      );
    });

    it('panel item should be an object', (ok, ko) => {
      try {
        panelItem.should.be.an.Object();
        ok();
      }
      catch ( error ) {
        ko(error);
      }
    });

    it('id', [ it => {
      it('should have id which is a string', (ok, ko) => {
        try {
          panelItem.should.have.property('id').which.is.a.String();
          ok();
        }
        catch ( error ) {
          ko(error);
        }
      });

      if ( 'id' in item ) {
        it('should have the same id than item', (ok, ko) => {
          try {
            panelItem.id.should.be.exactly(item.id);
            ok();
          }
          catch ( error ) {
            ko(error);
          }
        });
      }
    }]);

    it('subject', [ it => {
      it('should have subject which is a string', (ok, ko) => {
        try {
          panelItem.should.have.property('subject').which.is.a.String();
          ok();
        }
        catch ( error ) {
          ko(error);
        }
      });

      if ( 'subject' in item ) {
        it('should have the same subject than item', (ok, ko) => {
          try {
            panelItem.subject.should.be.exactly(item.subject);
            ok();
          }
          catch ( error ) {
            ko(error);
          }
        });
      }
    }]);

    it('description', [ it => {
      it('should have description which is a string', (ok, ko) => {
        try {
          panelItem.should.have.property('description').which.is.a.String();
          ok();
        }
        catch ( error ) {
          ko(error);
        }
      });

      if ( 'description' in item ) {
        it('should have the same description than item', (ok, ko) => {
          try {
            panelItem.description.should.be.exactly(item.description);
            ok();
          }
          catch ( error ) {
            ko(error);
          }
        });
      }
    }]);

    if ( 'image' in panelItem ) {
      it('image', [ it => {
        it('should have image which is a string', (ok, ko) => {
          try {
            panelItem.should.have.property('image').which.is.a.String();
            ok();
          }
          catch ( error ) {
            ko(error);
          }
        });

        if ( 'image' in item ) {
          it('should have the same image than item', (ok, ko) => {
            try {
              panelItem.image.should.be.exactly(item.image);
              ok();
            }
            catch ( error ) {
              ko(error);
            }
          });
        }
      }]);
    }

    if ( 'references' in panelItem ) {
      it('references', [ it => {
        it('should have references which is an array', (ok, ko) => {
          try {
            panelItem.should.have.property('references').which.is.an.Array();
            ok();
          }
          catch ( error ) {
            ko(error);
          }
        });

        if ( panelItem.references.length ) {
          it('should have 1 reference', (ok, ko) => {
            try {
              panelItem.references.should.have.length(1);
              ok();
            }
            catch ( error ) {
              ko(error);
            }
          });

          it('reference', [ it => {
            it('should be an object', (ok, ko) => {
              panelItem.references[0].should.be.an.Object();
              ok();
            });
            it('url', [ it => {
              it('should have url', (ok, ko) => {
                panelItem.references[0].should.have.property('url');
                ok();
              });
              it('should be an url', (ok, ko) => {
                /^https?:\/\//.test(panelItem.references[0].url).should.be.true();
                ok();
              });
            }]);
            if ( 'title' in panelItem.references[0] ) {
              it('title', [ it => {
                it('should have title', (ok, ko) => {
                  panelItem.references[0].should.have.property('title');
                  ok();
                });
                it('should be a string', (ok, ko) => {
                  panelItem.references[0].title.should.be.a.String();
                  ok();
                });
              }]);
            }
          }]);
        }

        if ( 'references' in item && item.references.length ) {
          it('should have the same references than item', (ok, ko) => {
            try {
              panelItem.references[0].url.should.be.exactly(item.references[0].url);
              ok();
            }
            catch ( error ) {
              ko(error);
            }
          });
        }
      }]);
    }

    it('promotions', [ it => {
      it('should have promotions which is a number', (ok, ko) => {
        try {
          panelItem.should.have.property('promotions').which.is.a.Number();
          ok();
        }
        catch ( error ) {
          ko(error);
        }
      });

      if ( 'promotions' in item ) {
        it('should have the same promotions than item', (ok, ko) => {
          try {
            panelItem.promotions.should.be.exactly(item.promotions);
            ok();
          }
          catch ( error ) {
            ko(error);
          }
        });
      }
    }]);

    it('views', [ it => {
      it('should have views which is a number', (ok, ko) => {
        try {
          panelItem.should.have.property('views').which.is.a.Number();
          ok();
        }
        catch ( error ) {
          ko(error);
        }
      });

      if ( 'views' in item ) {
        it('should have the same views than item', (ok, ko) => {
          try {
            panelItem.views.should.be.exactly(item.views);
            ok();
          }
          catch ( error ) {
            ko(error);
          }
        });
      }
    }]);

    it('Popularity', [ it => {
      it('should have popularity', (ok, ko) => {
        panelItem.should.have.property('popularity');
        ok();
      });
      it('should be a Popularity', describe.use(() => isPopularity(panelItem.popularity, locals.item.views, locals.item.promotions)));
    }]);
  };
}

export default isPanelItem;
