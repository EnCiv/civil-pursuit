'use strict';

import fs                       from 'fs';
import path                     from 'path';
import React                    from 'react';
import ReactDOM                 from 'react-dom';
import { renderToString }       from 'react-dom/server'
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
    
    let isIn=null;

    if ( req.cookies && req.cookies.synuser ) {
        isIn = req.cookies.synuser;

        if ( typeof isIn === 'string' ) {
          isIn = JSON.parse(isIn);
        } 
    }

    const props       =   {
      env             :   this.app.get('env'),
      path            :   req.path,
      intro           :   JSON.parse(JSON.stringify(this.props.intro)),
      item            :   JSON.parse(JSON.stringify(req.item || null)),
      panel           :   JSON.parse(JSON.stringify(req.panel || null)),
      panels          :   JSON.parse(JSON.stringify(req.panels || null)),
      ready           :   false,
      user            :   isIn,
      notFound        :   req.notFound,
      error           :   res.locals.error
    };

    props.react = Object.assign({}, props);

    delete props.react.env, props.react.rendered;

    props.rendered = ReactDOM.renderToString(
      React.createFactory(App)(props.react)
    );

    res.send(new Index(props).render());
  }
  catch ( error ) {
    next(error);
  }
}

export default home;
