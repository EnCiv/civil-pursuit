'use strict';

import S from 'string';
import getProps from 'syn/lib/app/props';

var cache = {}

function renderPage (req, res, next) {
  let props       =   getProps(this, req, res);
  let pageName    =   S(props.page).capitalize().camelize().s;

  if ( pageName in cache ) {
    return res.send(cache[pageName]);
  }

  let Page        =   require('syn/pages/' + pageName + '/View');
  let page        =   new Page(props);

  cache[pageName] = page.render();

  res.send(cache[pageName]);

  if ( pageName === 'Component' ) {
    delete cache[pageName];
  }
}

export default renderPage;
