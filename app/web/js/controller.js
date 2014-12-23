; ! function () {

  'use strict';

  module.exports = {
    'monson get':               require('./controllers/monson-get'),
    'template':                 require('./controllers/template'),
    'get intro':                require('./controllers/get-intro'),
    'panels template':          require('./controllers/panels-template'),
    'bind panel':               require('./controllers/bind-panel'),
    'get panel items':          require('./controllers/get-panel-items')
  };

} ();
