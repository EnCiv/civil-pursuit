module.exports = function ($http) {
  return {

    // Create a new evaluation using item

    make: function (item) {
      return $http.post('/json/Evaluation/make', { item: item });
    },

    // Find evaluation by id

    findById: function (id) {
      return $http.get('/json/Evaluation/findById/' + id + '?populate::item+items._id');
    }
  };
};
