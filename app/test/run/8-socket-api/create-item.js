'use strict';

import describe                   from 'redtea';
import should                     from 'should';
import mock                       from 'syn/../../dist/lib/app/socket-mock';
import createItem                 from 'syn/../../dist/api/create-item';
import isUser                     from 'syn/../../dist/test/assertions/is-user';
import User                       from 'syn/../../dist/models/user';
import isItem                     from 'syn/../../dist/test/assertions/is-item';
import Item                       from 'syn/../../dist/models/item';
import Type                       from 'syn/../../dist/models/type';
import isType                     from 'syn/../../dist/test/assertions/is-type';
import isPanelItem                from 'syn/../../dist/test/assertions/is-panel-item';

function test (props) {
  const locals = {};

  return describe ( ' API / Create Item', it => {

    it('Type', it => {

      it('should get random type', () => new Promise((ok, ko) => {
        Type.findOneRandom().then(
          type => {
            locals.type = type;
            ok();
          },
          ko
        );
      }));

      it('should be a type', describe.use(() => isType(locals.type)));

    });

    it('Create item', () => new Promise((ok, ko) => {
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
    }));

    it('should be a panel item', describe.use(() => {
      return isPanelItem(locals.item);
    }));

    it('Verify in DB', it => {

      it('Get item again', () => new Promise((ok, ko) => {
        Item.findById(locals.item).then(
          item => {
            locals.item = item;
            ok();
          },
          ko
        );
      }));

      it('should be an item', describe.use(() => isItem(locals.item)));

    });

  });
}

export default test;
