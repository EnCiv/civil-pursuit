module.exports = function ($http) {
  return {
    find: function (query) {
      var url = '/json/Entry';

      var params = [];

      if ( query && Object.keys(query).length ) {
        for ( var q in query ) {
          params.push([q,query[q]].join('='));
        }
      }

      if ( params.length ) {
        url += '?' + params.join('&');
      }

      return $http.get(url);
    },

    findById: function (id) {
      return $http.get('/json/Entry/findById/' + id);
    },

    findByIdAndUpdate: function (id, entry) {
      return $http.put('/json/Entry/statics/updateById/' + id, entry);
    },

    evaluate: function (topic) {
      return $http.get('/json/Entry/statics/evaluate/' + topic);
    },

    publish: function (entry) {
      return $http.post('/json/Entry', entry);
    },

    view: function (entry) {
      return $http.put('/json/Entry?_id=' + entry, JSON.stringify({ "$inc": { views: 1 } }) );
    },

    promote: function (entry) {
      return $http.put('/json/Entry?_id=' + entry, JSON.stringify({ "$inc": { promotions: 1 } }) );
    }
  };
};