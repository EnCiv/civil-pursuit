'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _ = require('../');

var _2 = _interopRequireDefault(_);

var Foo1 = (function (_Mung$Model) {
  function Foo1() {
    _classCallCheck(this, Foo1);

    if (_Mung$Model != null) {
      _Mung$Model.apply(this, arguments);
    }
  }

  _inherits(Foo1, _Mung$Model);

  _createClass(Foo1, null, [{
    key: 'schema',
    value: function schema() {
      return {
        string: String,

        number: Number,

        boolean: Boolean,

        date: Date,

        object: Object,

        mixed: _2['default'].Mixed,

        strings: [String],

        uniqueNumbers: {
          type: [Number],
          distinct: true
        },

        subdocument: {
          type: {
            string: String,
            number: Number
          }
        },

        subdocumentEmbeddedSyntax: _2['default'].embed({
          foo: String
        }),

        arrayOfEmbedded: [_2['default'].embed({ bar: Boolean })],

        complexSubdocument: {
          type: {
            string: {
              type: String,
              required: true
            },
            number: Number,
            strings: [String],
            booleans: {
              type: [Boolean]
            },
            subdoc: {
              type: {
                foo: {
                  type: String
                }
              }
            }
          }
        },

        arrayOfSubdocument: [{
          string: String
        }],

        index: {
          type: Number,
          index: true
        },

        unique: {
          type: Number,
          unique: true
        },

        indexWithType: {
          type: String,
          index: 'text'
        },

        indexWithOptions: {
          type: Boolean,
          index: {
            background: true,
            sort: -1
          }
        },

        coumpoundIndex: {
          type: String,
          unique: ['string']
        },

        complexCoumpoundIndex: {
          type: String,
          unique: { fields: ['number'], background: true }
        },

        indexInSubdocument: {
          type: {
            string: {
              type: String,
              index: 'deppsubdo'
            },
            subdocument: {
              type: {
                foo: {
                  type: Date,
                  index: 'deepdeep'
                }
              }
            }
          }
        },

        indexInArrayOfSubdocuments: [{
          foobarz: {
            type: String,
            index: true
          }
        }],

        uniqueInArray: {
          type: [Number],
          distinct: true
        },

        defaultValue: {
          type: Number,
          'default': 0
        },

        defaultFunction: {
          type: Date,
          'default': Date.now
        },

        defaultInArray: [{
          foo: {
            type: Object,
            'default': { foo: 1 }
          }
        }],

        defaultInSubdocument: {
          type: {
            foo: {
              type: String,
              'default': 'foo'
            }
          }
        },

        required: {
          type: String,
          required: true
        }
      };
    }
  }]);

  return Foo1;
})(_2['default'].Model);

;

var schema = Foo1.getSchema();

describe('Document', function () {

  var document1 = new Foo1({});

  console.log(require('util').inspect(document1.__types, { depth: 15 }));

  console.log('-----------------------------------');

  console.log(require('util').inspect(document1.__indexes, { depth: 15 }));

  console.log('-----------------------------------');

  console.log(require('util').inspect(document1.__defaults, { depth: 15 }));

  describe('Type', function () {

    it('should have property __types', function () {

      document1.should.have.property('__types');
    });

    describe('__types', function () {

      describe('_id', function () {

        it('should have property _id', function () {

          document1.__types.should.have.property('_id');
        });

        describe('type', function () {

          it('should be ObjectID', function () {

            document1.__types._id.should.be.exactly(_2['default'].ObjectID);
          });
        });
      });

      describe('__v', function () {

        it('should have property __v', function () {

          document1.__types.should.have.property('__v');
        });
        describe('type', function () {

          it('should be Number', function () {

            document1.__types.__v.should.be.exactly(Number);
          });
        });
      });

      describe('__V', function () {

        it('should have property __V', function () {

          document1.__types.should.have.property('__V');
        });

        describe('type', function () {

          it('should be Number', function () {

            document1.__types.__V.should.be.exactly(Number);
          });
        });
      });

      describe('string', function () {

        it('should have property string', function () {

          document1.__types.should.have.property('string');
        });

        describe('type', function () {

          it('should be String', function () {

            document1.__types.string.should.be.exactly(String);
          });
        });
      });

      describe('number', function () {

        it('should have property number', function () {

          document1.__types.should.have.property('number');
        });

        describe('type', function () {

          it('should be Number', function () {

            document1.__types.number.should.be.exactly(Number);
          });
        });
      });

      describe('boolean', function () {

        it('should have property boolean', function () {

          document1.__types.should.have.property('boolean');
        });

        describe('type', function () {

          it('should be Boolean', function () {

            document1.__types.boolean.should.be.exactly(Boolean);
          });
        });
      });

      describe('date', function () {

        it('should have property date', function () {

          document1.__types.should.have.property('date');
        });

        describe('type', function () {

          it('should be Date', function () {

            document1.__types.date.should.be.exactly(Date);
          });
        });
      });

      describe('object', function () {

        it('should have property object', function () {

          document1.__types.should.have.property('object');
        });

        describe('type', function () {

          it('should be Object', function () {

            document1.__types.object.should.be.exactly(Object);
          });
        });
      });

      describe('mixed', function () {

        it('should have property mixed', function () {

          document1.__types.should.have.property('mixed');
        });

        describe('type', function () {

          it('should be Mixed', function () {

            document1.__types.mixed.should.be.exactly(_2['default'].Mixed);
          });
        });
      });

      describe('strings', function () {

        it('should have property strings', function () {

          document1.__types.should.have.property('strings');
        });

        describe('types', function () {

          it('should be an array', function () {

            document1.__types.strings.should.be.an.Array;
          });

          describe('type', function () {

            it('should be String', function () {

              document1.__types.strings[0].should.be.exactly(String);
            });
          });
        });
      });

      describe('subdocument', function () {

        it('should have property subdocument', function () {

          document1.__types.should.have.property('subdocument');
        });

        describe('types', function () {

          it('should be an object', function () {

            document1.__types.subdocument.should.be.an.Object;
          });

          describe('type string', function () {

            it('should have subtype string', function () {

              document1.__types.subdocument.should.have.property('string');
            });

            it('should be string', function () {

              document1.__types.subdocument.string.should.be.exactly(String);
            });
          });

          describe('type number', function () {

            it('should have subtype number', function () {

              document1.__types.subdocument.should.have.property('number');
            });

            it('should be number', function () {

              document1.__types.subdocument.number.should.be.exactly(Number);
            });
          });
        });
      });
    });
  });

  describe('Index', function () {

    describe('__indexes', function () {

      it('should have property __indexes', function () {});
    });
  });

  describe('Modifiers', function () {

    describe('Array modifiers', function () {

      describe('push', function () {

        it('should be a function', function () {

          document1.should.have.property('push').which.is.a.Function();
        });

        describe('regular push', function () {

          it('should push a new string to strings', function () {

            document1.push('strings', 'hello');
          });

          it('should have pushed', function () {

            document1.strings.should.containEql('hello');
          });
        });

        describe('push to distinct array', function () {

          it('should push', function () {

            document1.push('uniqueNumbers', 1);
          });

          it('should have pushed', function () {

            document1.uniqueNumbers.should.containEql(1);
          });

          it('should throw error', function () {

            (function () {
              document1.push('uniqueNumbers', 1);
            }).should['throw']('Array only accepts distinct values');
          });

          it('should not have pushed', function () {

            document1.uniqueNumbers.should.have.length(1);
          });
        });
      });
    });
  });
});