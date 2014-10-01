module.exports = function ($http) {
  return {
    findTopics: function () {
      return $http.get('/json/Item?type=Topic');
    },

    findProblems: function (options) {
      options = options || {};

      var params = [];

      for ( var option in options ) {
        params.push(option + '=' + options[option]);
      }

      return $http.get('/json/Item?' + params.join('&'));
    },

    insert: function (item) {
      return $http.post('/json/Item', item);
    }
  };
};