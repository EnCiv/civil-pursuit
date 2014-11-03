/**
 * `getPromotedPercentageFilter` Get the promotion rate of an item as percentage
 * 
 * @module synapp
 * @class Filter
 * @method filter::get-promoted-percentage
 * @return {Number}
 * @param {Object} item - Items to parse
 * @example
 *    <!-- HTML -->
 *    <ANY ng-bind='item | getPromotedPercentageFilter' />
 *    
 *    // JS
 *    var percent = getPromotedPercentageFilter(item)
 * @author francoisrvespa@gmail.com
*/

module.exports = function () {
  return function getPromotedPercentage (item) {
    if ( item ) {
      if ( ! item.promotions ) {
        return 0;
      }

      return Math.ceil(item.promotions * 100 / item.views);
    }
  };
};
