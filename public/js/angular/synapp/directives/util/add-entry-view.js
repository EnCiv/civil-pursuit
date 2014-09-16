module.exports = function (EntryFactory) {
  return {
    restrict: 'C',

    link: function ($scope, $elem, $attr) {
      if ( $attr.entry ) {
        EntryFactory.view($attr.entry);
      }
    }
  };
};