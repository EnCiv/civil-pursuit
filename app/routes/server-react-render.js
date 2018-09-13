'use strict';

import fs                       from 'fs';
import path                     from 'path';
import React                    from 'react';
import ReactDOM                 from 'react-dom/server';
import App                      from '../components/app';
import Index                    from '../pages/index';
import makeProps                from '../props';

function serverReactRender (req, res, next) {
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
    
    let user=null;

    if ( req.cookies && req.cookies.synuser ) {
        user = req.cookies.synuser;

        if ( typeof user === 'string' ) {
          user = JSON.parse(user);
        } 
    } else if (req.user) {  // new turk worker, the cookie won't get set until this massage goes out - so extract the synuser info from the request
      user = {id: req.user._id, email: req.user.email}
      if(req.user.assignmentId) user.assignmentId=req.user.assignmentId;
    }

    const props       =   {
      env             :   this.app.get('env'),
      path            :   req.path,
      item            :   JSON.parse(JSON.stringify(req.item || null)),
      panel           :   JSON.parse(JSON.stringify(req.panel || null)),
      panels          :   JSON.parse(JSON.stringify(req.panels || null)),
      ready           :   false,
      user            :   user,
      activation_key  :   req.activation_key,
      notFound        :   req.notFound,
      error           :   res.locals.error,
      browserConfig   :   JSON.parse(JSON.stringify(this.browserConfig || null)),
      MechanicalTurkTask : req.MechanicalTurkTask || null
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

export default serverReactRender;
