! function () {
  
  'use strict';

  var html5     =   require('syn/lib/html5');
  var config    =   require('syn/config.json');

  module.exports = function StyleSheets (locals) {

    return html5.Elements(
      
      html5.Element.styleSheet('/css/normalize.css')
      
    );

  };

} ();
