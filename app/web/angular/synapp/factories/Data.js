/**
 * `DataFactory` Data -> monson factory
 * 
 * @module synapp
 * @method factory::data
 * @return {AngularFactory}
 * @author francoisrvespa@gmail.com
*/

;(function () {
  module.exports = ['$http', DataFactory];

  function DataFactory ($http) {

    var batchSize = synapp["navigator batch size"];

    function querystring_format (url, query) {

      var params = [];
      
      query = query || {};

      // Set limit

      var limit = null, sort = null;

      for ( var q in query ) {
        if ( ! isNaN(q) ) {
          limit = +q;
        }
      }

      if ( limit === null ) {
        query[batchSize] = undefined;
      }

      for ( var field in query ) {
        if ( query[field] === undefined ) {
          params.push(field);
        }
        else {
          params.push([field, query[field]].join('='));
        }
      }

      url += '?' + params.join('&');

      return url;
    }

    return {
      Item: {
        find: function (item) {
          item['sort:promotions-,created-'] = undefined;
          return $http.get(querystring_format('/models/Item', item));
        },

        update: function (id, item) {
          return $http.put('/models/Item?_id=' + id, item);
        },

        create: function (item) {
          return $http.post('/models/Item', item);
        },
        
        evaluate: function (id) {
          return $http
            .get('/models/Item.evaluate/' + id);
        },

        details: function (id) {
          return $http
            .get('/models/Item.details/' + id);
        }
      },

      Feedback: {
        find: function (feedback) {
          return $http.get(querystring_format('/models/Feedback', feedback));
        },

        create: function (item, feedback) {
          return $http.post('/models/Feedback', {feedback: feedback, item: item});
        }
      },

      Criteria: {
        find: function (criteria) {
          criteria[100] = undefined;
          criteria['sort:criteria+'] = undefined;
          return $http.get(querystring_format('/models/Criteria', criteria));
        }
      },

      Vote: {
        find: function (vote) {
          return $http.get(querystring_format('/models/Vote', vote));
        },

        create: function (vote) {
          return $http.post('/models/Vote', vote);
        }
      }
    };
  };
})();
