'use strict';

import S              from 'string';
import getProps       from '../lib/app/props';

var cache = {}

function renderPage (req, res, next) {

  try {
    let props       =   getProps(this, req, res);

    let pageName    =   S(props.page).slugify().s;

    let Page        =   require('../pages/' + pageName + '/view');
    
    let page        =   new Page(props);

    cache[pageName] = page.render();

    res.send(cache[pageName]);

    if ( pageName === 'Component' ) {
      delete cache[pageName];
    }
  }

  catch ( error ) {
    next(error);
  }

}

export default renderPage;
