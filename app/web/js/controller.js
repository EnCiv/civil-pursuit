; ! function () {

  'use strict';

  module.exports = {
    'monson get':               require('./controllers/monson-get'),
    'template':                 require('./controllers/template'),
    'get intro':                require('./controllers/get-intro'),
    'panels template':          require('./controllers/panels-template'),
    'items template':           require('./controllers/items-template'),
    'bind item':                require('./controllers/bind-item'),
    'bind panel':               require('./controllers/bind-panel'),
    'find panel':               require('./controllers/find-panel'),
    'get panel items':          require('./controllers/get-panel-items')
  };

} ();
