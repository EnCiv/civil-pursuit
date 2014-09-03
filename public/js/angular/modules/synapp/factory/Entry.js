module.exports = function ($http) {
  return {
    find: function () {
      return $http.get('/json/Entry');
    },

    publish: function (entry) {
      return $http.post('/json/Entry', entry);
    }
  };
};