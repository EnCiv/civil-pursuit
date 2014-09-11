module.exports = function ($http) {
  return {
    find: function () {
      return $http.get('/json/Entry');
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
    }
  };
};