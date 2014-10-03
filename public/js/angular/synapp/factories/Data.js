module.exports = function ($http) {

  var url = '/json/';

  function Model (model) {
    this.model = model;
    this.query = {};

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
    
    this.applyQuery();

    return $http.get(this.url);
  };

  Model.prototype.post = function(payload) {
    return $http.post(this.url, payload);
  };

  Model.prototype.put = function(payload) {

    this.applyQuery();

    return $http.put(this.url, payload);
  };

  return {
    model: function (model) {
      return new Model(model);
    },

    Evaluation: {
      get: function (id) {
        return new Model('Evaluation')

          .findById(id)

          .populate('item', 'items._id')

          .get();
      }
    },

    User_Evaluation: {
      get: function (evaluation) {
        return new Model('User_Evaluation')

          .findOne()

          .put({ evaluation: evaluation });
      },

      create: function (evaluation, items) {
        return new Model('User_Evaluation')

          .post({ evaluation: evaluation, items: items });
      }
    },

    Item: {
      set: function (id, set) {
        console.log('got set', set)
        return new Model('Item')

          .addQuery({ _id: id })

          .put(JSON.stringify(set));
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
