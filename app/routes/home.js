'use strict';

import fs                       from 'fs';
import path                     from 'path';
import React                    from 'react';

function home (req, res, next) {
  try {
    if ( this.app.get('env') === 'development' ) {
      let dir = path.resolve(__dirname, '../../dist');

      for ( let cache in require.cache ) {
        let _dir = cache.substr(0, dir.length);

        if ( _dir === dir ) {

          let _dir2 = cache.substr(dir.length);

          if ( ! /^\/((models))/.test(_dir2) ) {
            delete require.cache[cache];
          }
        }
      }
    }
    let App = require('../components/app');

    let AppFactory = React.createFactory(App);

    let Index = require('../pages/index');

    let props = {
      env         :   this.app.get('env'),
      path        :   req.path,
      user        :   false,
      intro       :   this.props.intro
    }

    let source = new Index(props).render();

    let app = AppFactory(props);

    source = source.replace(/<!-- #synapp -->/, React.renderToString(app));

    res.send(source);
  }
  catch ( error ) {
    next(error);
  }
}

export default home;
