'use strict';

import describe                   from 'redtea';
import should                     from 'should';
import testWrapper                from '../../../lib/app/test-wrapper';
import mock                       from '../../../lib/app/socket-mock';
import createItem                 from '../../../api/create-item';
import isPanelItem                from '../../is/panel-item';
import Config                     from '../../../models/config';
import User                       from '../../../models/user';

function test (props) {
  const locals = {};

  return testWrapper(
    'API → Create Item',
    {
      mongodb : true,
      http : { verbose : true },
      sockets : true
    },
    wrappers => it => {

      const locals = {
        item : {
          subject : 'This is a subject -- test API create item',
          description : 'This is a description -- test API create item'
        }
      };

      it('Should get top level type', () =>
        Config
          .get('top level type')
          .then(type => { Object.assign(locals.item, { type }) })
      );

      it('should get default user', () =>
        User
          .findOne()
          .then(user => { Object.assign(locals.item, { user }) })
      );

      it('Create item', it => {
        it('should create item', () => new Promise((ok, ko) => {
          createItem
            .apply(wrappers.sockets.apiClient, [ locals.item ]);

          wrappers.sockets.apiClient
            .on('error', ko)
            .on('OK create item', created => {
              locals.created = created;
              ok();
            });
        }));

        it('should have returned a panel item',
          describe.use(() => isPanelItem(locals.created, locals.item))
        );
      });

    }
  );
}

export default test;
