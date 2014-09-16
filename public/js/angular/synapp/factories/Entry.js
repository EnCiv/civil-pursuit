module.exports = function ($http) {
  return {
    find: function (query) {
      var url = '/json/Entry/statics';

      query = query || {};

      var params = [];

      for ( var q in query ) {
        if ( query[q] ) {
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

    findByTopicSlug: function (topicSlug) {
      return $http.get('/json/Entry/statics/findByTopicSlug/' + topicSlug);
    },

    findByIdAndUpdate: function (id, entry) {
      return $http.put('/json/Entry/statics/updateById/' + id, entry);
    },

    evaluate: function (topic) {
      return $http.get('/json/Entry/statics/evaluate/' + topic);
    },

    create: function (entry) {
      return $http.post('/json/Entry/statics/add', entry);
    },

    get: function (options) {
      return $http.put('/json/Entry/statics/get', options);
    },

    // Increment view

    view: function (entry) {
      return $http.put('/json/Entry?_id=' + entry, JSON.stringify({ "$inc": { views: 1 } }) );
    },

    // Increment promotions

    promote: function (entry) {
      return $http.put('/json/Entry?_id=' + entry, JSON.stringify({ "$inc": { promotions: 1 } }) );
    }
  };
};