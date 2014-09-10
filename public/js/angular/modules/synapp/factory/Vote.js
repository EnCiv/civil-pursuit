module.exports = function ($http) {
  return {
    create: function (vote) {
      return $http.post('/json/Vote', vote);
    }
  };
};