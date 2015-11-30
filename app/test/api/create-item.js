'use strict';

import describe                   from '../../lib/util/describe';
import should                     from 'should';
import mock                       from '../mock';
import createItem                 from '../../api/create-item';
import isUser                     from '../../lib/assertions/user';
import User                       from '../../models/user';
import isItem                     from '../../lib/assertions/item';
import Item                       from '../../models/item';
import Type                       from '../../models/type';
import isType                     from '../../lib/assertions/type';
import isPanelItem                from '../../lib/assertions/panel-item';

function test (props) {
  const locals = {};

  return describe ( ' API / Create Item', [
    {
      'Type' : [
        {
          'should get random type' : (ok, ko) => {
            Type.findOneRandom().then(
              type => {
                locals.type = type;
                ok();
              },
              ko
            );
          }
        },
        {
          'should be a type' : (ok, ko) => {
            locals.type.should.be.a.typeDocument();
            ok();
          }
        }
      ]
    },
    {
      'Create item' : (ok, ko) => {
        locals.candidate = {
            subject : 'Item created via socket',
            description : 'Some description here',
            type : locals.type
        };

        mock(props.socket, createItem, 'create item', locals.candidate)
          .then(
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
        locals.item.should.be.a.panelItem(locals.candidate, {}, true);
        ok();
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
          'should be an item' : (ok, ko) => {
            locals.item.should.be.an.item(locals.candidate);
            ok();
          }
        }
      ]
    }
  ]);
}

export default test;
