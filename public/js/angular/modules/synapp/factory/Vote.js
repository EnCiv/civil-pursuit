module.exports = function ($http) {
  return {
    create: function (vote) {
      return $http.post('/json/Vote', vote);
    },

    findByEntries: function (entries) {

      entries = entries.map(function (entry) {
        if ( typeof entry === 'string' ) {
          return entry;
        }

        return entry._id;
      })

      return $http.put('/json/Vote/statics/findByEntries', entries);
    },

    getAccumulation: function (entry) {
      return $http.get('/json/Vote/statics/getAccumulation/' + entry);
    }
  };
};