'use strict';

import describe                   from 'redtea';
import socketClient               from 'socket.io-client';
import User                       from 'syn/../../dist/models/user';
import Socket                     from 'syn/../../dist/lib/app/socket-mockup';

function test (props) {
  const locals = {
    url : `http://localhost:${props.port}`
  };

  props.socket = Socket({
    port : props.port
  });

  return describe ( 'API', it => {

    it(`Connect to ${locals.url}`, [ it => {
      it('it should connect', () => new Promise((ok, ko) => {

        try {
          locals.client1 = socketClient.connect(locals.url, {
            transports: ['websocket'],
            'force new connection': true
          });

          locals.client1
            .on('error', ko)
            .on('connect', ok);
        }
        catch ( error ) {
          ko(error);
        }

      }));

      it('should set synuser', () => new Promise((ok, ko) => {
        User
          .findOne()
          .then(
            user => {
              try {
                const json = user.toJSON();
                props.socket.synuser = {
                  id : json._id
                };
                ok();
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
      }));
    }]);

  });
}

export default test;
