/**
 * `NavigatorCtrl` Navigator
 * 
 * @module controllers/navigator
 * @prop $scope {q}
 * @example
 *    <ANY ng-controller="NavigatorCtrl" />
 * @author francoisrvespa@gmail.com
*/

module.exports = function NavigatorCtrl ($scope, DataFactory, $timeout) {

  var Topic = DataFactory.Topic,
    Problem = DataFactory.Problem;

  /** 
   *  @prop $scope.navigator {Object} */
  
  $scope.navigator = {};

  /** Attach {@link module:controllers/navigator~onClickMore} to all elements with classname "more".
   *    This function is called once via a $timeout
   *
   *  @function activateMoreLess
   */

  function activateMoreLess () {
    $('.more').on('click',

      /** Change maximum to 1000 and update scope.
       *
       *  @function onClickMore
       *  @param e {Event}
       *  @return {boolean} false
       */

      function onClickMore (e) {
        var item = $(this).data('item');
        item.$maxChars = 1000;
        angular.element($(this)).scope().$digest();
        e.preventDefault();
        return false;
      });
  }

  /** call {@link module:controllers/navigator~activateMoreLess} in 250 miliseconds */

  $timeout(activateMoreLess, 250);

  /** Attach {@link module:controllers/navigator~onClickMore} to all elements with classname "more".
   *    This function is called once via a $timeout
   *
   *  @function moreLess
   */

  $scope.moreLess = function (is) {
    $timeout(function () {
      is.$maxChars = 1000;
    }, 250);
    return false;
  };

  function getCollapsedItem (event) {
    var bits = $(event.target).attr('id').split('-');

    var type = bits[0];
    var id = bits[1];
    var has = bits[2];

    return {
      is: $scope[type].filter(function (t) {
        return t._id === id;
      }),
      type: type,
      id: id,
      has: has
    };
  }

  Topic.get()
    .success(function (data) {
      $scope.topics = data;

      $timeout(function () {
        $('.navigator .collapse').on('show.bs.collapse', function (evt) {

          var item = getCollapsedItem(evt);

          if ( item.is.length ) {
            is = item.is[0];

            if ( ! is.$loaded ) {
              switch ( item.type ) {
                case 'topics':
                  Problem.get(item.id)

                    .success(function (problems) {
                      is.$showButtons = true;
                      is.$problems = problems;
                      is.$loaded = true;
                    });
                  break;
              }
            }

            else {
              $scope.$apply(function () {
                is.$showButtons = true;
              });
            }
          }
        });

        $('.navigator .collapse').on('hide.bs.collapse', function (evt) {
          var item = getCollapsedItem(evt);

          if ( item.is.length ) {
            is = item.is[0];

            $scope.$apply(function () {
              is.$showButtons = false;
            });
          }
        });
      });
    });
};
