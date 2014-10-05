/**
 * `fromNowFilter` return a moment().fromNow()
 * 
 * @module filters/from-now
 * @example
 *    <!-- HTML -->
 *    <ANY ng-bind='new Date(2014) | fromNowFilter' />
 *    
 *    // JS
 *    var fromNow = fromNowFilter();
 * @author francoisrvespa@gmail.com
*/

module.exports = function fromNowFilter () {

  /** @method fromNow
   * @param date {?Date}
   * @return {?Moment}
  */
  function fromNow (date) {
    return moment(date).format('ddd DD MMM YY HH:mm:ss');
  }

  return fromNow;
};
