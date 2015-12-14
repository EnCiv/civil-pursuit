'use strict';

import describe                   from 'redtea';
import should                     from 'should';
import mock                       from '../../lib/app/socket-mock';
import addView                    from '../../api/add-view';
import User                       from '../../models/user';
import isItem                     from '../.test/assertions/is-item';
import Item                       from '../../models/item';

function test (props) {
  const locals = {};

  return describe ( ' API / Add View', [
    {
      'Item' : [
        {
          'should get random item' : (ok, ko) => {
            Item.findOneRandom().then(
              item => {
                locals.item = item;
                ok();
              },
              ko
            );
          }
        },
        {
          'should be an item' : describe.use(() => isItem(locals.item))
        },
        {
          'get number of views' : (ok, ko) => {
            locals.views = locals.item.views;
            ok();
          }
        }
      ]
    },
    {
      'Add view' : (ok, ko) => {
        mock(props.socket, addView, 'add view', locals.item)
          .then(
            views => {
              views.should.be.a.Number().and.be.exactly(locals.views + 1);
              ok();
            },
            ko
          );
      }
    },
    {
      'Verify in DB' : [
        {
          'Get item again' : (ok, ko) => {
            Item.findById(locals.item).then(
              item => {
                locals.item = item;
                ok();
              },
              ko
            );
          }
        },
        {
          'views has been incremented' : (ok, ko) => {
            locals.item.should.have.property('views')
              .which.is.a.Number()
              .and.is.exactly(locals.views + 1);

            ok();
          }
        }
      ]
    }
  ]);
}

export default test;
