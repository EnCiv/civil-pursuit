#!/usr/bin/env node
'use strict';

!(function () {

  'use strict';

  var model = process.argv[2];
  var action = process.argv[3];

  var mongoose = require('mongoose');

  mongoose.connect(process.env.MONGOHQ_URL);

  var Model = require('../models/' + model);

  function close(error, results) {
    if (error) {
      throw error;
    }
    console.log(results);
    mongoose.disconnect();
  }

  switch (action) {
    case 'findOne':
    case 'find':
    case 'count':

      var query = {};

      try {
        query = JSON.parse(process.argv[4]);
      } catch (error) {}

      var q = Model[action](query);

      var options = {};

      try {
        options = JSON.parse(process.argv[5]);
      } catch (error) {}

      if (typeof options.skip === 'number') {
        q.skip(options.skip);
      }

      if (typeof options.limit === 'number') {
        q.limit(options.limit);
      }

      q.exec(close);

      break;

    case 'create':
    case 'remove':

      var query = {};

      try {
        query = JSON.parse(process.argv[4]);
      } catch (error) {}

      var q = Model[action](query, close);

      break;

    default:

      var args = [];

      for (var i = 4; i < process.argv.length; i++) {
        try {
          args.push(JSON.parse(process.argv[i]));
        } catch (error) {
          console.log(error);
        }
      }

      args.push(close);

      console.log(action, args);

      var q = Model[action].apply(Model, args);

      break;
  }
})();