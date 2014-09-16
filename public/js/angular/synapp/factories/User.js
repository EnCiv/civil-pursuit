module.exports = function ($http) {
  return {
    signIn: function (creds) {
      return $http.post('/sign/in', creds);
    },

    signUp: function (creds) {
      return $http.post('/sign/up', creds);
    },

    findByEmail: function (email) {
      return $http.get('/json/User/findOne?email=' + email);
    }
  };
};