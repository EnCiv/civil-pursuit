/**
 *  Navigator Controller (`NavigatorCtrl`)
 *  ======================================
 *
 *  Controls the navigation and three-way binds items.
 *
 *  ## Type lineage
 *
 *  Navigator shows items grouped by type lineage. 
 *  
 *  - Topics
 *    - Problems
 *      - Opinions
 *      - Solutions
 *        - Opinions
 *
 *
 *  ## Loading data flow
 *
 *  Navigator works by lazy loading. It does not load data until a User Event triggers it to do so. The only exception to that are topics that gets downloaded on `ng-init`
 *
 *  Data loads a default batch of 15 items with the option of loading more via User Event. Every batch downloaded stays in the Memory.
 *
 *  The function used to fetch data is {@link getTopics}.
 *
 *  ## Bootstrap
 *  
 *  We use {@link http://getbootstrap.com/javascript/#collapse| Bootstrap collapse} to expand/squeeze items and sub-items
 *
 *  ### Bootstrap integration in Scope
 *
 *  The controller listen to Bootstrap's collapse `show` and `hide` events and calls either {@link module:controllers/navigator~onCollapse} or {@link module:controllers/navigator~onCollapse}.
 * 
 *  @module controllers/navigator
 *  @prop $scope {k} - Controller's scope
 *  @prop $scope.topics {NavigatorItem[]} - Array of topics
 *  @see {@link https://docs.angularjs.org/guide/controller| Angular Documentation: Controller}
 *  @see {@link https://docs.angularjs.org/api/ng/directive/ngController| Angular Documentation: ngController}
 *  @see {@link https://docs.angularjs.org/api/ng/service/$timeout| Angular Documentation: $timeout}
 *  @see {@link http://getbootstrap.com/javascript/#collapse| Bootstrap Documentation: collapse}
 *  @example
 *    <ANY ng-controller="NavigatorCtrl" ng-init="getTopics()" />
 *  @todo Possible memory leaks with all the batch of items being kept in the Memory. Maybe defining a maximum of items?
 * @author francoisrvespa@gmail.com
*/

module.exports = function NavigatorCtrl ($scope, DataFactory, $timeout) {
  'use strict';

  var Topic = DataFactory.Topic,
    Problem = DataFactory.Problem;

  /** @function 
   *  @param {Object} evt - DOM Event
   */

  function onCollapse (evt) {

    var target = $(event.target).closest('.box'),
      targetScope = angular.element(target).scope();

    targetScope.$apply(function () {
        targetScope.$showButtons = false;
      });
  }

  /** @function 
   *  @param {Object} evt - DOM Event
   */

  function onExpand (evt) {
    /** Get item's info */

    var target = $(event.target).closest('.box'),
      targetScope = angular.element(target).scope();

    if ( angular.element(target).data('is-navigable') ) {
      return;
    }

    angular.element(target).data('is-navigable', true);

    if ( ! targetScope.$type ) {
      ['topic', 'problem'].forEach(function (type) {
        if ( type in targetScope ) {
          targetScope.$type = type;
        }
      });
    }

    if ( ! targetScope.$loaded ) {
      switch ( targetScope.$type ) {
        case 'topic':
          Problem.get(targetScope[targetScope.$type]._id)

            .success(function (problems) {
              targetScope.$showButtons  =   true;
              targetScope.$loaded       =   true;
              targetScope.$problems     =   problems;
            });
          break;

        case 'problem':
          
          break;
        }
    }

    else {
      targetScope.$apply(function () {
        targetScope.$showButtons = true;
      });
    }

    return console.log(targetScope);
  }

  /** Function to add listeners to Bootstrap collapse's events
   *  This function gets called upon success of {@link getTopics}
   *  @function onLoaded
   */

  function onLoaded () {
    $('.navigator .collapse')
      .on('show.bs.collapse', onExpand)
      .on('hide.bs.collapse', onCollapse);
  }

  /** @function getTopics */

  function getTopics () {
    Topic.get()
      .success(function (topics) {

        $scope.topics = topics;

        $timeout(onLoaded);
      });
  }

  $scope.getTopics = getTopics;
};
