// ----- Angular directive $('.synapp-sign') ---------------------------------------------------  //
/*
 *  @abstract Angular directive for all elements with class name "synapp-sign"
 *  @return   Object directive
 *  @param    Object TopicFactory
 */
// ---------------------------------------------------------------------------------------------  //
module.exports = function (EntryFactory, TopicFactory) { // ----- uses factory/Sign.js ------------------------  //
  return {
    // ---- Restrict directive to class --------------------------------------------------------  //
    restrict: 'C',
    // ---- Link function ----------------------------------------------------------------------  //
    link: function ($scope) {
      //
      $scope.doIt = function ($last) {
        if ( $last ) {
          $("input.slider").slider({
            formatter: function(value) {
              return 'Current value: ' + value;
            }
          });
        }
      }

      TopicFactory.findBySlug(evaluatePage)
        .error(function (error) {
          console.error(error);
        })
        .success(function (data) {
          EntryFactory.evaluate(data.found._id)
            .error(function (error) {
              console.error(error);
            })
            .success(function (data) {
              $scope.evaluate = data;
            });
        });
    }
  };
};