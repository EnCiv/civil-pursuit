module.exports = function () {
  return {
    restrict: 'C',

    link: function ($scope, $elem, $attr) {
      for ( attr in $attr ) {
        if ( /^import[A-Z]/.test(attr) ) {
          $scope[attr.replace(/^import/, '').toLowerCase()] = $attr[attr];
        }
      }
    }
  };
};