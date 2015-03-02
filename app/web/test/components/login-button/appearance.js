! function () {
  
  'use strict';

  /**
   * Checks if the given attribute of an element contains the expected value.
   *
   * ```
   *    this.demoTest = function (client) {
   *      browser.assert.comp_loginButton_appeareance('#someElement', 'href', 'google.com');
   *    };
   * ```
   *
   * @method attributeContains
   * @param {string} selector The selector (CSS / Xpath) used to locate the element.
   * @param {string} attribute The attribute name
   * @param {string} expected The expected contained value of the attribute to check.
   * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
   * @api assertions
   */

  exports.assertion = function () {

    /**
     * The message which will be used in the test output and 
     * inside the XML reports
     * @type {string}
     */
    this.message = 'This is a test message';
    
    /**
     * A value to perform the assertion on. If a function is 
     * defined, its result will be used.
     * @type {function|*}
     */
    this.expected = function() {
      return expected;
    };
    
    /**
     * The method which performs the actual assertion. It is 
     * called with the result of the value method as the argument.
     * @type {function}
     */
    this.pass = function(value) {
      return true;
    };

    /**
     * The method which returns the value to be used on the 
     * assertion. It is called with the result of the command's 
     * callback as argument.
     * @type {function}
     */
    this.value = function(result) {
      
    };
    
    /**
     * Performs a protocol command/action and its result is 
     * passed to the value method via the callback argument.
     * @type {function}
     */
    this.command = function(callback) {
       
      return this;
    };

  };

} ();
