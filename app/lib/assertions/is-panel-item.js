'use strict';

import describe                   from 'redtea';
import config                     from '../../../public.json';
import Item                       from '../../models/item';
import Type                       from '../../models/type';
import User                       from '../../models/user';
import isPopularity               from './is-popularity';
import isObjectID                 from './is-object-id';
import isItem                     from './is-item';
import isType                     from './is-type';
import isUser                     from './is-user';

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

    it('should get user', (ok, ko) => {
      User.findById(locals.item.user).then(
        user => {
          locals.user = user;
          ok();
        },
        ko
      );
    });

    it('should get type', (ok, ko) => {
      Type.findById(locals.item.type).then(
        type => {
          locals.type = type;
          ok();
        },
        ko
      );
    });

    it('should get harmony types', (ok, ko) => {
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
    });

    it('should get number of votes', (ok, ko) => {
      locals.item.countVotes().then(
        votes => {
          locals.votes = votes;
          ok();
        },
        ko
      );
    });

    it('should get number of children', (ok, ko) => {
      locals.item.countChildren().then(
        children => {
          locals.children = children;
          ok();
        },
        ko
      );
    });

    it('should get number of harmony', (ok, ko) => {
      locals.item.countHarmony().then(
        harmony => {
          console.log({ harmony });
          locals.harmony = harmony;
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
      else {
        it('should have default image', (ok, ko) => {
          panelItem.image.should.be.exactly(config['default item image']);
          ok();
        });
      }
    }]);

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

    if ( 'parent' in panelItem ) {
      it('Parent', [ it => {
        it('should have property parent', (ok, ko) => {
          panelItem.should.have.property('parent');
          ok();
        });
        it('should be an item', describe.use(() => isItem(panelItem.parent, item.parent, serialized)));
      }]);
    }

    it('Lineage', [ it => {
      it('should have lineage', (ok, ko) => {
        panelItem.should.have.property('lineage');
        ok();
      });
      it('should be an array', (ok, ko) => {
        panelItem.lineage.should.be.an.Array();
        ok();
      });

      it('should be object ids', [ it => {
        panelItem.lineage.forEach(item => it('should be an object id', describe.use(() => isObjectID(item, null, serialized))));
      }]);

      it('get lineage', (ok, ko) => {
        locals.item.getLineage().then(
          lineage => {
            locals.lineage = lineage;
            ok();
          },
          ko
        );
      });
      it('should have same length', (ok, ko) => {
        panelItem.lineage.length.should.be.exactly(locals.lineage.length);
        ok();
      });
      it('should match', (ok, ko) => {
        locals.lineage.forEach((lineage, index) => {
          panelItem.lineage[index].toString().should.be.exactly(lineage.toString());
        });
        ok();
      });
    }]);

    it('Subtype', [ it => {
      it('should have subtype', (ok, ko) => {
        panelItem.should.have.property('subtype');
        ok();
      });
      it('should get subtype', (ok, ko) => {
        locals.type.getSubtype().then(
          subtype => {
            locals.subtype = subtype;
            ok();
          },
          ko
        );
      });
      it('should be a type', describe.use(() => isType(panelItem.subtype, locals.subtype)));
    }]);

    it('Votes', [ it => {
      it('should have votes', (ok, ko) => {
        panelItem.should.have.property('votes');
        ok();
      });
      it('should be a number', (ok, ko) => {
        panelItem.votes.should.be.a.Number();
        ok();
      });
      it('should match votes', (ok, ko) => {
        panelItem.votes.should.be.exactly(locals.votes);
        ok();
      })
    }]);

    it('Children', [ it => {
      it('should have children', (ok, ko) => {
        panelItem.should.have.property('children');
        ok();
      });
      it('should be a number', (ok, ko) => {
        panelItem.children.should.be.a.Number();
        ok();
      });
      it('should match children', (ok, ko) => {
        panelItem.children.should.be.exactly(locals.children);
        ok();
      })
    }]);

    it('Harmony', [ it => {
      it('should have harmony', (ok, ko) => {
        panelItem.should.have.property('harmony');
        ok();
      });
      it('should be an object', (ok, ko) => {
        panelItem.harmony.should.be.an.Object();
        ok();
      });
      it('pro', [ it => {
        it('should have pro', (ok, ko) => {
          panelItem.harmony.should.have.property('pro');
          ok();
        });
        it('should be a number', (ok, ko) => {
          panelItem.harmony.pro.should.be.a.Number();
          ok();
        });
        it('should match', (ok, ko) => {
          panelItem.harmony.pro.should.be.exactly(locals.harmony.pro);
          ok();
        });
      }]);
      it('harmony', [ it => {
        it('should have harmony', (ok, ko) => {
          panelItem.harmony.should.have.property('harmony');
          ok();
        });
        it('should be a number', (ok, ko) => {
          panelItem.harmony.harmony.should.be.a.Number();
          ok();
        });
        it('should match', (ok, ko) => {
          panelItem.harmony.harmony.should.be.exactly(locals.harmony.harmony);
          ok();
        });
      }]);
      it('con', [ it => {
        it('should have con', (ok, ko) => {
          panelItem.harmony.should.have.property('con');
          ok();
        });
        it('should be a number', (ok, ko) => {
          panelItem.harmony.con.should.be.a.Number();
          ok();
        });
        it('should match', (ok, ko) => {
          panelItem.harmony.con.should.be.exactly(locals.harmony.con);
          ok();
        });
      }]);
      it('types', [ it => {
        it('should have types', (ok, ko) => {
          panelItem.harmony.should.have.property('types');
          ok();
        });
        it('should be an array', (ok, ko) => {
          panelItem.harmony.types.should.be.an.Array();
          ok();
        });
        it('should be types', [ it => {
          it('should be pro', describe.use(() => isType(panelItem.harmony.types[0], locals.pro, serialized)));

          it('should be con', describe.use(() => isType(panelItem.harmony.types[1], locals.con, serialized)));
        }]);
      }]);
    }]);

    it('user', [ it => {
      it('should have user', (ok, ko) => {
        panelItem.should.have.property('user');
        ok();
      });
      it('should be a user', describe.use(() => isUser(panelItem.user, locals.user, serialized)));
    }]);

  };
}

export default isPanelItem;
