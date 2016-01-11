'use strict';

import describe                   from 'redtea';
import should                     from 'should';
import config                     from 'syn/../../dist/../public.json';
import Item                       from 'syn/../../dist/models/item';
import Type                       from 'syn/../../dist/models/type';
import User                       from 'syn/../../dist/models/user';
import isPopularity               from './popularity';
import isObjectID                 from './object-id';
import isItem                     from './item';
import isType                     from './type';
import isUser                     from './user';

function checkTypes (pro, con, types, serialized) {
  return it => {
    if ( pro && con ) {
      it('should be an array', () => types.should.be.an.Array());

      it('should be types', it => {
        it('should be pro', describe.use(() => isType(types[0], pro, serialized)));

        it('should be con', describe.use(() => isType(types[1], con, serialized)));
      });
    }
    else {
      it('type has no harmony', [ it => {
        it('should be undefined', () => should(types).be.undefined());
      }]);
    }
  }
}

function isPanelItem (panelItem, item = {}, serialized = false) {

  const locals = {};

  return it => {
    it(serialized ? 'should be serialized' : 'should not be serialized', () => {});

    it('panel item should be an object', () => panelItem.should.be.an.Object());

    it('_id', describe.use(() => isObjectID(panelItem._id, item._id, serialized)));

    // it('_id', it => it(() => isObjectID(panelItem._id, item._id, serialized)));

    it('should get item', () => new Promise((ok, ko) => {
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
    }));

    it('should get user', () => new Promise((ok, ko) => {
      User.findById(locals.item.user).then(
        user => {
          locals.user = user;
          ok();
        },
        ko
      );
    }));

    it('should get type', () => new Promise((ok, ko) => {
      Type.findById(locals.item.type).then(
        type => {
          locals.type = type;
          ok();
        },
        ko
      );
    }));

    it('should get harmony types', () => new Promise((ok, ko) => {
      Promise.all(
        locals.type.harmony.map(harmony => Type.findById(harmony))
      ).then(
        results => {
          locals.pro = results[0];
          locals.con = results[1];
          ok();
        },
        ko
      );
    }));

    it('should get number of votes', () => new Promise((ok, ko) => {
      locals.item.countVotes().then(
        votes => {
          locals.votes = votes;
          ok();
        },
        ko
      );
    }));

    it('should get number of children', () => new Promise((ok, ko) => {
      locals.item.countChildren().then(
        children => {
          locals.children = children;
          ok();
        },
        ko
      );
    }));

    it('should get number of harmony', () => new Promise((ok, ko) => {
      locals.item.countHarmony().then(
        harmony => {
          locals.harmony = harmony;
          ok();
        },
        ko
      );
    }));

    it('id', [ it => {
      it('should have id which is a string', () => panelItem.should.have.property('id').which.is.a.String());

      if ( 'id' in item ) {
        it('should have the same id than item', () => panelItem.id.should.be.exactly(item.id));
      }
    }]);

    it('subject', [ it => {
      it('should have subject which is a string', () => panelItem.should.have.property('subject').which.is.a.String());

      if ( 'subject' in item ) {
        it('should have the same subject than item', () => panelItem.subject.should.be.exactly(item.subject));
      }
    }]);

    it('description', [ it => {
      it('should have description which is a string', () => panelItem.should.have.property('description').which.is.a.String());

      if ( 'description' in item ) {
        it('should have the same description than item', () => panelItem.description.should.be.exactly(item.description));
      }
    }]);

    it('image', [ it => {
      it('should have image which is a string', () => panelItem.should.have.property('image').which.is.a.String());

      if ( 'image' in item ) {
        it('should have the same image than item', () => panelItem.image.should.be.exactly(item.image));
      }
      // else {
      //   it('should have default image', (ok, ko) => {
      //     panelItem.image.should.be.exactly(config['default item image']);
      //     ok();
      //   });
      // }
    }]);

    if ( 'references' in panelItem ) {
      it('references', it => {

        console.log(panelItem);

        it('should have references which is an array', () => panelItem.should.have.property('references').which.is.an.Array());

        if ( panelItem.references.length ) {
          it('should have 1 reference', () => panelItem.references.should.have.length(1));

          it('reference', [ it => {
            it('should be an object', () => panelItem.references[0].should.be.an.Object());

            it('url', [ it => {
              it('should have url', () => panelItem.references[0].should.have.property('url'));
              it('should be an url', (ok, ko) => {
                /^https?:\/\//.test(panelItem.references[0].url).should.be.true();
              });
            }]);
            if ( 'title' in panelItem.references[0] ) {
              it('title', [ it => {
                it('should have title', () => panelItem.references[0].should.have.property('title'));

                it('should be a string', () => panelItem.references[0].title.should.be.a.String());
              }]);
            }
          }]);
        }

        if ( 'references' in item && item.references.length ) {
          it('should have the same references than item', () => panelItem.references[0].url.should.be.exactly(item.references[0].url));
        }

      });
    }

    it('promotions', [ it => {
      it('should have promotions which is a number', () => panelItem.should.have.property('promotions').which.is.a.Number());

      if ( 'promotions' in item ) {
        it('should have the same promotions than item', () => panelItem.promotions.should.be.exactly(item.promotions));
      }
    }]);

    it('views', [ it => {
      it('should have views which is a number', () => panelItem.should.have.property('views').which.is.a.Number());

      if ( 'views' in item ) {
        it('should have the same views than item',   () => panelItem.views.should.be.exactly(item.views));
      }
    }]);

    it('Popularity', [ it => {
      it('should have popularity', () => panelItem.should.have.property('popularity'));

      it('should be a Popularity', describe.use(() => isPopularity(panelItem.popularity, locals.item.views, locals.item.promotions)));
    }]);

    if ( 'parent' in panelItem ) {
      it('Parent', [ it => {
        it('should have property parent', (ok, ko) => {
          panelItem.should.have.property('parent');
        });

        it('should be an item', describe.use(() => isItem(panelItem.parent, item.parent, serialized)));
      }]);
    }

    it('Lineage', [ it => {
      it('should have lineage', (ok, ko) => {
        panelItem.should.have.property('lineage');
      });

      it('should be an array', (ok, ko) => {
        panelItem.lineage.should.be.an.Array();
      });

      it('should be object ids', [ it => {
        panelItem.lineage.forEach(item => it('should be an object id', describe.use(() => isObjectID(item, null, serialized))));
      }]);

      it('get lineage', () => new Promise((ok, ko) => {
        locals.item.getLineage().then(
          lineage => {
            locals.lineage = lineage;
            ok();
          },
          ko
        );
      }));

      it('should have same length', (ok, ko) => {
        panelItem.lineage.length.should.be.exactly(locals.lineage.length);
      });

      it('should match', (ok, ko) => {
        locals.lineage.forEach((lineage, index) => {
          panelItem.lineage[index].toString().should.be.exactly(lineage.toString());
        });
      });
    }]);

    it('Subtype', [ it => {
      it('should have subtype', (ok, ko) => {
        panelItem.should.have.property('subtype');
      });
      it('should get subtype', () => new Promise((ok, ko) => {
        locals.type.getSubtype().then(
          subtype => {
            locals.subtype = subtype;
            ok();
          },
          ko
        );
      }));

      if ( ! panelItem.subtype ) {
        it('should be null', (ok, ko) => {
          should(locals.subtype).be.null();
        });
      }
      else {
        it('should be a type', describe.use(() => isType(panelItem.subtype, locals.subtype)));
      }
    }]);

    it('Votes', [ it => {
      it('should have votes', (ok, ko) => {
        panelItem.should.have.property('votes');
      });
      it('should be a number', (ok, ko) => {
        panelItem.votes.should.be.a.Number();
      });
      it('should match votes', (ok, ko) => {
        panelItem.votes.should.be.exactly(locals.votes);
      })
    }]);

    it('Children', [ it => {
      it('should have children', (ok, ko) => {
        panelItem.should.have.property('children');
      });
      it('should be a number', (ok, ko) => {
        panelItem.children.should.be.a.Number();
      });
      it('should match children', (ok, ko) => {
        panelItem.children.should.be.exactly(locals.children);
      })
    }]);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    /*  {
     *    "pro"       :   undefined || Number
     *    "con"       :   undefined || Number
     *    "harmony"   :   undefined || Number
     *    "types"     :   undefined || [Type]
     *  }
     */
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Harmony', [ it => {
      it('should have harmony', (ok, ko) => {
        panelItem.should.have.property('harmony');
      });
      it('should be an object', (ok, ko) => {
        panelItem.harmony.should.be.an.Object();
      });
      it('pro', [ it => {
        it('should have pro', (ok, ko) => {
          panelItem.harmony.should.have.property('pro');
        });
        if ( locals.pro ) {
          it('should be a number', (ok, ko) => {
            panelItem.harmony.pro.should.be.a.Number();
          });
        }
        it('should match', (ok, ko) => {
          should(panelItem.harmony.pro).be.exactly(locals.harmony.pro);
        });
      }]);
      it('harmony', [ it => {
        it('should have harmony', (ok, ko) => {
          panelItem.harmony.should.have.property('harmony');
        });
        if ( locals.pro && locals.con ) {
          it('should be a number', (ok, ko) => {
            panelItem.harmony.harmony.should.be.a.Number();
          });
        }
        it('should match', (ok, ko) => {
          should(panelItem.harmony.harmony).be.exactly(locals.harmony.harmony);
        });
      }]);
      it('con', [ it => {
        it('should have con', (ok, ko) => {
          panelItem.harmony.should.have.property('con');
        });
        if ( locals.con ) {
          it('should be a number', (ok, ko) => {
            panelItem.harmony.con.should.be.a.Number();
          });
        }
        it('should match', (ok, ko) => {
          should(panelItem.harmony.con).be.exactly(locals.harmony.con);
        });
      }]);
      it('types', [ it => {
        it('should have types', (ok, ko) => {
          panelItem.harmony.should.have.property('types');
        });
        it('should be the correct types', describe.use(() => checkTypes(locals.pro, locals.con, panelItem.harmony.types, serialized)))
      }]);
    }]);

    it('user', [ it => {
      it('should have user', (ok, ko) => {
        panelItem.should.have.property('user');
      });
      it('should be a user', describe.use(() => isUser(panelItem.user, locals.user, serialized)));
    }]);

  };
}

export default isPanelItem;
