;(function () {

  module.exports = ['$rootScope', getEvaluationItems];

  function getEvaluationItems ($rootScope) {
    return function (items, item_id) {
      if ( items && item_id ) {
        var evaluation = $rootScope.evaluations
          .reduce(function (evaluation, candidate) {
            if ( candidate.item === item_id ) {
              evaluation = candidate;
            }
            return evaluation;
          }, null);

        if ( evaluation ) {
          return evaluation.items;
        }

        return [];
      }
    };
  }

})();