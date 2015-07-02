'use strict';

import S from 'string';
import getProps from 'syn/lib/app/export-locals';

var cache = {}

function renderView (req, res, next) {
  let props       =   getProps(this, req, res);
  let viewName    =   S(req.params.component).capitalize().camelize().s;

  if ( viewName in cache ) {
    return res.send(cache[viewName]);
  }

  let View        =   require('syn/components/' + viewName + '/view');
  let view        =   new View(props);

  cache[viewName] = view.render();

  res.send(cache[viewName]);
}

export default renderView;
