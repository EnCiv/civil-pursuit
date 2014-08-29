module.exports = function ($http) {
  return {
    find: function () {
      return $http.get('/json/Topic');
    },

    up: function (creds) {
      return $http.post('/sign/up', creds);
    }
  };
};