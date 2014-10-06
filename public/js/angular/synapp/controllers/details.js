/**
 * `DetailsCtrl` Details
 * 
 * @module controllers/details
 * @prop item_id {string} - The item's id (retrieved from URL)
 * @prop item {ItemSchema} - The item
 * @prop votes {Accumulation} - Item's votes
 * @prop feedbacks {FeedbackSchema[]} - Item's feedbacks
 * @prop criterias {CriteriaSchema[]} - Item type's criterias
 * @example
 *    <ANY ng-controller="DetailsCtrl" ng-init="item_id = $routeParams.item_id" />
 * @author francoisrvespa@gmail.com
*/

module.exports = function DetailsCtrl ($scope, DataFactory, $timeout) {

  $timeout(function () {
    DataFactory.Item.get($scope.item_id)
      .success(function (details) {
        $scope.item       = details.item;

        $scope.votes      = details.votes;

        $scope.feedbacks  = details.feedbacks;

        $scope.criterias  = details.criterias;

        $scope.hasVotes   = Object.keys(details.votes).length;
      });
  }, 500);
};
