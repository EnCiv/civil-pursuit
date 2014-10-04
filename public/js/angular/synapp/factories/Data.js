module.exports = function ($http) {

  var url = '/json/';

  function Model (model) {
    this.model    = model;
    this.query    = {};
    this.sorters  = [];

    this.url = url + model + '/';
  }

  Model.prototype.action = function(action) {
    this.url += action + '/';

    return this;
  };

  Model.prototype.findById = function(id) {
    this.action('findById');
    this.params([id]);

    return this;
  };

  Model.prototype.updateById = function(id) {
    this.action('updateById');
    this.params([id]);

    return this;
  };

  Model.prototype.findOne = function(id) {
    this.action('findOne');

    return this;
  };

  Model.prototype.params = function(params) {
    if ( Array.isArray(params) ) {
      this.url += params.join('/') + '/';
    }

    return this;
  };

  Model.prototype.populate = function() {

    var populators = [];

    for ( var i in arguments ) {
      populators.push(arguments[i]);
    }

    this.query['populate::' + populators.join('+')] = null;

    return this;
  };

  Model.prototype.sort = function(field, reverse) {
    var sorter = field;

    if ( reverse ) {
      sorter += '-';
    }

    this.sorters.push(sorter);

    return this;
  };

  Model.prototype.applySorters = function() {
    if ( this.sorters.length ) {
      this.query['sort::' + this.sorters.join(',')] = null;
    }
  };

  Model.prototype.addQuery = function(object) {
    for ( var i in object ) {
      this.query[i] = object[i];
    }

    return this;
  };

  Model.prototype.applyQuery = function() {
    if ( Object.keys(this.query).length ) {
      var queries = [];

      for ( var i in this.query ) {
        if ( this.query[i] ) {
          queries.push(i + '=' + this.query[i]);
        }
        else {
          queries.push(i);
        }
      }

      this.url += '?' + queries.join('&');
    }
  };

  Model.prototype.get = function() {
    return this.request('get');
  };

  Model.prototype.post = function(payload) {
    return this.request('post', payload);
  };

  Model.prototype.put = function(payload) {
    return this.request('put', payload);
  };

  Model.prototype.request = function(method, payload) {
    this.applySorters();

    this.applyQuery();

    var q = $http[method](this.url, payload);

    q.ok = q.success;
    q.ko = q.error;

    return q;
  };

  return {
    model: function (model) {
      return new Model(model);
    },

    Item: {
      set: function (id, set) {
        return new Model('Item')

          .addQuery({ _id: id })

          .put(JSON.stringify(set));
      },

      evaluate: function (id) {
        return new Model('Item')

          .action('evaluate')

          .params([id])

          .get();
      },

      get: function (id) {
        return new Model('Item')

          .action('details')

          .params([id])

          .get();
      }
    },

    Topic: {
      get: function () {
        return new Model('Item')

          .addQuery({ type: 'Topic' })

          .sort('promotions', true)

          .get();
      }
    },

    Problem: {
      get: function (topic) {
        return new Model('Item')

          .addQuery({
            type: 'Problem',
            parent: topic
          })

          .sort('promotions', true)

          .get();
      }
    },

    Feedback: {
      create: function (itemId, feedback) {
        return new Model('Feedback')

          .post({
            item: itemId,
            feedback: feedback
          });
      }
    }
  };
};
