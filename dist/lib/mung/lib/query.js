'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _mung = require('./mung');

var _mung2 = _interopRequireDefault(_mung);

var Query = (function () {
  function Query() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Query);

    this.options = options;

    if (!this.options.model) {
      throw new Error('Missing model');
    }
  }

  _createClass(Query, [{
    key: 'connection',
    value: function connection() {
      var connection = this.options.connection;

      if (!connection) {
        connection = _mung2['default'].connections[0];
      }

      if (!connection) {
        throw new Error('No connection');
      }

      return connection;
    }
  }, {
    key: 'collection',
    value: function collection() {
      var _this = this;

      return new Promise(function (ok, ko) {
        try {
          var collection = _this.options.collection;

          if (!collection) {
            var connection = _this.connection();
            var connected = connection.connected;
            var db = connection.db;

            if (!connected) {
              connection.on('connected', function () {
                _this.collection().then(ok, ko);
              });
              return;
            }

            if (_this.options.collectionName) {
              collection = db.collection(_this.options.collectionName);
            } else {
              var model = _this.options.model;

              collection = db.collection(model.toCollectionName());
            }
          }

          if (!collection) {
            throw new Error('No collection');
          }

          ok(collection);
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'ensureIndexes',
    value: function ensureIndexes(collection) {
      var _this2 = this;

      return new Promise(function (ok, ko) {
        try {
          _this2.buildIndexes(new _this2.options.model().__indexes, collection).then(function () {
            ok();
          }, function (error) {
            if (error.code === 26) {
              /** No collection **/
              ok();
            } else {
              ko(error);
            }
          });
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'buildIndexes',
    value: function buildIndexes(_x2, collection) {
      var indexes = arguments[0] === undefined ? [] : arguments[0];

      return new Promise(function (ok, ko) {
        try {

          var fn = collection.indexes();

          fn.then(function (keys) {
            try {
              indexes = indexes.map(function (index) {
                index[2] = keys.some(function (key) {
                  return key.name === index[1].name;
                });

                return index;
              });

              var promises = indexes.filter(function (index) {
                return index[2];
              }).map(function (index) {
                return collection.dropIndex(index[0]);
              });

              Promise.all(promises).then(function () {
                try {
                  var _promises = indexes.map(function (index) {
                    return collection.createIndex(index[0], index[1]);
                  });

                  Promise.all(_promises).then(function (results) {
                    try {
                      results.forEach(function (indexName) {
                        indexes = indexes.map(function (index) {
                          if (index.name === indexName) {
                            index.created = true;
                          }
                          return index;
                        });
                      });
                      ok(indexes);
                    } catch (error) {
                      ko(error);
                    }
                  }, ko);
                } catch (error) {
                  ko(error);
                }
              }, ko);
            } catch (error) {
              ko(error);
            }
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'parse',
    value: function parse(query) {
      var Model = _mung2['default'].Model;
      var Util = _mung2['default'].Util;
      var model = this.options.model;

      return _mung2['default'].parseFindQuery(query, new this.options.model().__types);
    }
  }, {
    key: 'remove',
    value: function remove(document) {
      var _this3 = this;

      var options = arguments[1] === undefined ? {} : arguments[1];

      return new Promise(function (ok, ko) {
        try {
          var model = _this3.options.model;
          var schema = model.schema;

          if (typeof schema === 'function') {
            schema = schema();
          }

          _this3.collection().then(function (collection) {
            try {
              if (options.one) {
                collection.deleteOne(_this3.parse(document)).then(ok, ko);
              } else {
                collection.deleteMany(_this3.parse(document)).then(ok, ko);
              }
            } catch (error) {
              ko(error);
            }
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'insert',
    value: function insert(document, id) {
      var _this4 = this;

      return new Promise(function (ok, ko) {
        try {
          var model = _this4.options.model;
          var schema = model.schema;

          if (typeof schema === 'function') {
            schema = schema();
          }

          _this4.collection().then(function (collection) {
            try {
              (function () {

                var started = Date.now();

                if (id) {
                  collection.replaceOne({ _id: id }, document).then(function () {
                    ok();
                  }, ko);
                } else {
                  collection.insertOne(document).then(function (document) {
                    try {
                      if (document) {
                        Object.defineProperty(document, '__queryTime', {
                          enumerable: false,
                          writable: false,
                          value: Date.now() - started
                        });
                      }
                      ok(document);
                    } catch (error) {
                      ko(error);
                    }
                  }, ko);
                }
              })();
            } catch (error) {
              ko(error);
            }
          });
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'find',
    value: function find(document) {
      var _this5 = this;

      var options = arguments[1] === undefined ? {} : arguments[1];

      return new Promise(function (ok, ko) {
        try {
          (function () {
            var Document = _mung2['default'].Document;
            var model = _this5.options.model;
            var schema = model.schema;

            if (typeof schema === 'function') {
              schema = schema();
            }

            _this5.collection().then(function (collection) {
              try {
                (function () {
                  var projection = Query.project(options);

                  var parsed = _this5.parse(document);

                  var query = undefined;

                  if (options.one) {
                    if (collection.findOne) {
                      query = collection.findOne(parsed, projection);
                    } else {
                      query = collection.find(parsed).limit(1).skip(projection.skip).sort(projection.sort);
                    }
                  } else {
                    query = collection.find(parsed).limit(projection.limit).skip(projection.skip).sort(projection.sort).toArray();
                  }

                  query.then(function (documents) {
                    try {
                      if (options.one) {
                        if (collection.findOne) {
                          if (documents) {
                            documents = new model(documents);
                          }
                        } else if (documents.length) {
                          documents = new model(documents[0]);
                        }
                      } else {
                        documents = documents.map(function (doc) {
                          return new model(doc);
                        });
                      }

                      if (documents) {
                        (function () {

                          var packAndGo = function packAndGo() {

                            if (documents) {
                              Object.defineProperties(documents, {
                                __query: {
                                  numerable: false,
                                  writable: false,
                                  value: parsed
                                },

                                __limit: {
                                  numerable: false,
                                  writable: false,
                                  value: projection.limit
                                },

                                __skip: {
                                  numerable: false,
                                  writable: false,
                                  value: projection.skip
                                },

                                __sort: {
                                  numerable: false,
                                  writable: false,
                                  value: projection.sort
                                }
                              });
                            }

                            ok(documents);
                          };

                          if (options.populate) {
                            if (options.one && documents) {
                              documents.populate(options.populate).then(function () {
                                return packAndGo;
                              }, ko);
                            } else {
                              Promise.all(documents.map(function (document) {
                                return document.populate(options.populate);
                              })).then(function () {
                                return packAndGo;
                              }, ko);
                            }
                          } else {
                            packAndGo();
                          }
                        })();
                      } else {
                        ok(documents);
                      }
                    } catch (error) {
                      ko(error);
                    }
                  }, ko);
                })();
              } catch (error) {
                ko(error);
              }
            });
          })();
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'count',
    value: function count(document) {
      var _this6 = this;

      var options = arguments[1] === undefined ? {} : arguments[1];

      return new Promise(function (ok, ko) {
        try {
          (function () {
            var Document = _mung2['default'].Document;
            var model = _this6.options.model;
            var schema = model.schema;

            if (typeof schema === 'function') {
              schema = schema();
            }

            var parsed = undefined;

            try {
              parsed = _this6.parse(document);
            } catch (error) {
              throw new _mung2['default'].Error('Could not count from ' + model.name + ': parse error', { query: document, error: {
                  message: error.message, stack: error.stack, name: error.name, code: error.code
                } });
            }

            _this6.collection().then(function (collection) {
              try {
                collection.count(parsed).then(function (count) {
                  try {
                    ok(count);
                  } catch (error) {
                    ko(error);
                  }
                }, ko);
              } catch (error) {
                ko(error);
              }
            });
          })();
        } catch (error) {
          ko(error);
        }
      });
    }
  }], [{
    key: 'project',
    value: function project() {
      var options = arguments[0] === undefined ? {} : arguments[0];

      var projection = {};

      if ('limit' in options) {
        if (options.limit === false) {
          projection.limit = 0;
        } else {
          projection.limit = options.limit;
        }
      } else {
        projection.limit = 100;
      }

      projection.skip = options.skip || 0;

      projection.sort = options.sort || { _id: 1 };

      if (options.reverse) {
        for (var field in projection.sort) {
          projection.sort[field] = -1;
        }
      }

      return projection;
    }
  }]);

  return Query;
})();

_mung2['default'].Query = Query;