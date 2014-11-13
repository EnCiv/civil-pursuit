;(function () {

  module.exports = ['$rootScope', getEvaluationByItem];

  function getEvaluationByItem ($rootScope) {
    return function (evaluations, item_id) {
      if ( evaluations ) {
        return evaluations.filter(function (evaluation) {
          return evaluation.item === item_id;
        });
      }
    };
  }

})();