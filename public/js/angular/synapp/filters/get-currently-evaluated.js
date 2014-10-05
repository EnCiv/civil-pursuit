/**
 * `getCurrentlyEvaluatedFilter` Return the items being currently evaluated in an evaluation
 * 
 * @module filters/get-currently-evaluated
 * @example
 *    <!-- HTML -->
 *    <ANY ng-repeat='item in items | getCurrentlyEvaluatedFilter' />
 *    
 *    // JS +
 *    var currentlyEvaluated = getCurrentlyEvaluatedFilter(items);
 * @author francoisrvespa@gmail.com
*/

module.exports = function getCurrentlyEvaluatedFilter () {

  /** @method getCurrentlyEvaluated
   *  @param items {ItemSchema[]}
   *  @return {?ItemSchema[]}
   */

  function getCurrentlyEvaluated (items) {

    var current = [];
    
    if ( Array.isArray(items) && items.length ) {
      
      current.push(items[0]);

      if ( items[1] ) {
        current.push(items[1]);
      }
    }

    return current;
  }

  return getCurrentlyEvaluated;
};
