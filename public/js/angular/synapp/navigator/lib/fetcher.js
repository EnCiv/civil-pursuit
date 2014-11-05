;(function () {

  module.exports = Fetcher;

  function Fetcher (DataFactory, $scope) {
    return {
      get: function (cb) {
        DataFactory[$scope.type].get($scope.from)
          .success(function (items) {

            $scope.items = items;

            $scope.loaded ++;

            $scope.state = 1;

            if ( items.length ) {
              $scope.onItems(items);
            }

            if ( cb ) {
              cb();
            }
          });
      },

      load: function (cb) {
        var query = { type: $scope.type };

        if ( $scope.from ) {
          query.parent = $scope.from;
        }

        DataFactory.model('Item')
          .addQuery(query)
          .sort('promotions', true)
          .sort('created', true)
          .offset(6).limit(6)
          .get()

            .success(function (data) {
              $scope.loaded ++;
              $scope.items = $scope.items.concat(data);
              $scope.onItems(data);
            });
      }
    };
  }

})();
