;(function () {

  module.exports = [CriteriaFilter];

  function CriteriaFilter () {
    return function (criterias, criteria) {
      if ( criterias ) {
        return criterias.filter(function (_criteria) {
          for ( var key in criteria ) {
            if ( _criteria[key] !== criteria[key] ) {
              return false;
            }
          }
          return true;
        });
      }
    };
  }

})();
