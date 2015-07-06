'use strict';

!(function () {

  'use strict';

  var mongodb = require('mongodb');
  var Client = mongodb.MongoClient;
  var URL = require('url');

  function importModel(model, src, cb) {

    // First find source

    var srcName, url;

    switch (src) {
      case 'alpha':
        srcName = 'synappalpha';
        url = 'mongodb://alpha78!:' + encodeURIComponent('8d73jdSJWn?"ks') + '@kahana.mongohq.com:10078';
        break;
    }

    Client.connect(url, function (error, db) {
      if (error) {
        return cb(error);
      }
      var collection = db.collection(model);
      console.log(collection);
    });
  }

  module.exports = importModel;

  if (/import\.js$/.test(process.argv[1])) {
    importModel(process.argv[2], process.argv[3], console.log.bind(console));
  }
})();