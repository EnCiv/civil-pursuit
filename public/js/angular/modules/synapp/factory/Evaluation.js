module.exports = function ($http) {
  return {
    create: function (evaluation) {
      return $http.post('/json/Evaluation', evaluation);
    },

    findById: function (id) {
      return $http.get('/json/Evaluation/findById/' + id + '?$populate=topic entries._id');
    },

    promote: function (id, entry) {
      return $http.get('/json/Evaluation/statics/promote/' + id + '/' + entry);
    }
  };
};