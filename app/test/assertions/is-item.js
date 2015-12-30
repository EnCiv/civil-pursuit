'use strict';

import should                           from 'should';
import Mungo                            from 'mungo';
import describe                         from 'redtea';
import Item                             from 'syn/../../dist/models/item';
import isObjectID                       from './is-object-id';
import isDocument                       from './is-document';

function isItem (item, compare = {}, serialized = false, populated = []) {
  return it => {
    it(serialized ? 'should be serialized' : 'should not be serialized', () => {});

    it('should be a document', describe.use(() => isDocument(item, compare, serialized)));

    if ( ! serialized ) {
      it('should be a user', (ok, ko) => {
        item.should.be.an.instanceof(Item);
      });
    }

    it('subject', [ it => {
      it('should have a subject', (ok, ko) => {
        item.should.have.property('subject').which.is.a.String();
      });

      if ( 'subject' in compare ) {
        it('subject should match compare', (ok, ko) => {
          item.subject.should.be.exactly(compare.subject);
        });
      }
    }]);

    it('description', [ it => {
      it('should have a description', (ok, ko) => {
        item.should.have.property('description').which.is.a.String();
      });

      if ( 'description' in compare ) {
        it('description should match compare', (ok, ko) => {
          item.description.should.be.exactly(compare.description);
        });
      }
    }]);

    it('image', [ it => {
      if ( 'image' in item ) {
        it('should have image which is a string', (ok, ko) => {
          try {
            item.should.have.property('image').which.is.a.String();
          }
          catch ( error ) {
            ko(error);
          }
        });
      }

      if ( 'image' in compare ) {
        it('should have the same image than item', (ok, ko) => {
          try {
            item.image.should.be.exactly(compare.image);
          }
          catch ( error ) {
            ko(error);
          }
        });
      }
    }]);

    if ( 'references' in item ) {
      it('references', [ it => {
        it('should have references which is an array', (ok, ko) => {
          try {
            item.should.have.property('references').which.is.an.Array();
          }
          catch ( error ) {
            ko(error);
          }
        });

        if ( item.references.length ) {
          it('should have 1 reference', (ok, ko) => {
            try {
              item.references.should.have.length(1);
            }
            catch ( error ) {
              ko(error);
            }
          });

          it('reference', [ it => {
            it('should be an object', (ok, ko) => {
              item.references[0].should.be.an.Object();
            });
            it('url', [ it => {
              it('should have url', (ok, ko) => {
                item.references[0].should.have.property('url');
              });
              it('should be an url', (ok, ko) => {
                /^https?:\/\//.test(item.references[0].url).should.be.true();
              });
            }]);
            if ( 'title' in item.references[0] ) {
              it('title', [ it => {
                it('should have title', (ok, ko) => {
                  item.references[0].should.have.property('title');
                });
                it('should be a string', (ok, ko) => {
                  item.references[0].title.should.be.a.String();
                });
              }]);
            }
          }]);
        }

        if ( 'references' in compare && compare.references.length ) {
          it('should have the same references than item', (ok, ko) => {
            try {
              item.references[0].url.should.be.exactly(compare.references[0].url);
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
          item.should.have.property('promotions').which.is.a.Number();
        }
        catch ( error ) {
          ko(error);
        }
      });

      if ( 'promotions' in compare ) {
        it('should have the same promotions than item', (ok, ko) => {
          try {
            item.promotions.should.be.exactly(compare.promotions);
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
          item.should.have.property('views').which.is.a.Number();
        }
        catch ( error ) {
          ko(error);
        }
      });

      if ( 'views' in compare ) {
        it('should have the same views than item', (ok, ko) => {
          try {
            item.views.should.be.exactly(compare.views);
          }
          catch ( error ) {
            ko(error);
          }
        });
      }
    }]);

    it('user', [ it => {
      it('should have user', (ok, ko) => {
        item.should.have.property('user');
      });
      it('should be a user', describe.use(() => isObjectID(item.user, compare.user, serialized)));
    }]);

    if ( 'parent' in item ) {
      it('parent', [ it => {
        it('should have parent', (ok, ko) => {
          item.should.have.property('parent');
        });
        it('should be a parent', describe.use(() => isObjectID(item.parent, compare.parent, serialized)));
      }]);
    }

    if ( 'from' in item ) {
      it('from', [ it => {
        it('should have from', (ok, ko) => {
          item.should.have.property('from');
        });
        it('should be a from', describe.use(() => isObjectID(item.from, compare.from, serialized)));
      }]);
    }

    if ( 'type' in item ) {
      it('type', [ it => {
        it('should have type', (ok, ko) => {
          item.should.have.property('type');
        });
        it('should be a type', describe.use(() => isObjectID(item.type, compare.type, serialized)));
      }]);
    }

  };
}

export default isItem;
