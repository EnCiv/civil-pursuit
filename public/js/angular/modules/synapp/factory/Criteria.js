module.exports = function ($http) {
  return {
    find: function () {
      return $http.get('/json/Criteria');
    }
  };
};