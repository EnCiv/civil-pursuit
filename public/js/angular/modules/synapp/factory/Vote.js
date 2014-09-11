module.exports = function ($http) {
  return {
    create: function (vote) {
      return $http.post('/json/Vote', vote);
    },

    findByEntries: function (entries) {
    return $http.put('/json/Vote', { entries: entries });
  }
};
};