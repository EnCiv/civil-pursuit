module.exports = function ($http) {
  return {
    create: function (entryId, userEmail, feedback) {
      return $http({
        method: 'PUT',
        url: '/json/Feedback/statics/add/' + entryId + '/' + userEmail,
        data: feedback,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8'
        }
      });
    },

    find: function (options) {
      return $http.put('/json/Feedback/statics/get', options);
    }
  };
};