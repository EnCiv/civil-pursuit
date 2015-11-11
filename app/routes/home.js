'use strict';

import fs                       from 'fs';
import path                     from 'path';
import React                    from 'react';
import App                      from '../components/app';
import Index                    from '../pages/index';
import makeProps                from '../props';

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

    const AppFactory = React.createFactory(App);

    const props = makeProps({
      env         :   this.app.get('env'),
      path        :   req.path,
      intro       :   JSON.parse(JSON.stringify(this.props.intro)),
      item        :   JSON.parse(JSON.stringify(req.item || null)),
      panel       :   JSON.parse(JSON.stringify(req.panel || null)),
      backEnd     :   true
    });

    let source = new Index(props).render();

    const app = AppFactory(props);

    source = source.replace(/<!-- #synapp -->/, React.renderToString(app));

    res.send(source);
  }
  catch ( error ) {
    next(error);
  }
}

export default home;
