// ----- Angular directive $('.synapp-sign') ---------------------------------------------------  //
/*
 *  @abstract Angular directive for all elements with class name "synapp-sign"
 *  @return   Object directive
 *  @param    Object TopicFactory
 */
// ---------------------------------------------------------------------------------------------  //
module.exports = function (TopicFactory) { // ----- uses factory/Sign.js ------------------------  //
  return {
    // ---- Restrict directive to class --------------------------------------------------------  //
    restrict: 'C',
    // ---- Link function ----------------------------------------------------------------------  //
    link: function ($scope) {
      TopicFactory.find()
        .error(function (error) {
          console.error(error);
        })
        .success(function (data) {
          $scope.topics = data.Topic.found;
        });
    }
  };
};