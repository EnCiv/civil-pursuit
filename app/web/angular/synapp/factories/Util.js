;(function () {

  module.exports = ['$rootScope', Util];

  function Util ($rootScope) {
    return {
      view: {
        $rootScope: $rootScope,
        truncate: require('./Util/view/truncate'),
        toggle: require('./Util/view/toggle')
      }
    };
  }

})();
