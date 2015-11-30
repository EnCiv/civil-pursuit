'use strict';

import describe                   from '../../lib/util/describe';
import should                     from 'should';
import mock                       from '../mock';
import addView                    from '../../api/add-view';
import isUser                     from '../../lib/assertions/user';
import User                       from '../../models/user';
import isItem                     from '../../lib/assertions/item';
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
          'should be an item' : (ok, ko) => {
            locals.item.should.be.an.item();
            ok();
          }
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
