module.exports = function ($http) {
  return {
    find: function () {
      return $http.get('/json/Entry');
    },

    evaluate: function (topic) {
      return $http.get('/json/Entry/statics/evaluate/' + topic);
    },

    publish: function (entry) {
      return $http.post('/json/Entry', entry);
    }
  };
};