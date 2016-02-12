'use strict';

import describe               from 'redtea';
import should                 from 'should';
import User                   from '../../../../models/user';
import signOut                from '../../../util/e2e-sign-out';
import testWrapper            from '../../../../lib/app/test-wrapper';
import Config                 from '../../../../models/config';
import Item                   from '../../../../models/item';
import Type                   from '../../../../models/type';
import identify               from '../../../util/e2e-identify';
import createItem             from '../../../util/e2e-create-item';
import selectors              from '../../../../../selectors.json';
import isItem                 from '../../../is/item';
import isEvaluationView       from '../../../is/evaluation-view';

function test(props) {
  const locals = {
    subject : 'This is a subtype item',
    description : 'Blah blah blah'
  };

  return testWrapper(
    'Story -> Create -> Create subtype',
    { mongodb : true, http : { verbose : true }, driver : true },
    wrappers => it => {

      it('Populate data', it => {
        it('User', it => {
          it('should create user', () =>
            User.lambda().then(user => { locals.user = user })
          )
        });

        it('Parent item', it => {
          it('Get top level type', () =>
            Config.get('top level type')
              .then(type => { locals.topLevelType = type })
          );

          it('Get parent type', () =>
            Type.findById(locals.topLevelType)
              .then(type => { locals.parentType = type })
          );

          it('Get subtype', () =>
            locals.parentType.getSubtype()
              .then(type => { locals.subtype = type })
          );

          it('Create parent item', () =>
            Item.lambda({ type : locals.parentType })
              .then(item => { locals.parent = item } )
          );
        });
      });

      it('should go to home page', () =>
        wrappers.driver.client
          .url(`http://localhost:${wrappers.http.app.get('port')}`)
      );

      it('should sign in', describe.use(
        () => identify(wrappers.driver.client, locals.user)
      ));

      it('should close training', () => wrappers.driver.click(
        selectors.training.close, 2500
      ));

      it('should see parent', () => wrappers.driver.exists(
        selectors.item.id.prefix + locals.parent._id, 2500
      ));

      it('should reveal subtype', () => wrappers.driver.click(
        selectors.item.id.prefix + locals.parent._id + ' ' +
        selectors.item.subtype
      ));

      it('should click on toggle button', () => wrappers.driver.click(
        selectors.item.id.prefix + locals.parent._id + ' ' +
          selectors.create.toggle,
        2500
      ));

      it('should create item', describe.use(() => createItem(
        wrappers.driver,
        selectors.item.id.prefix + locals.parent._id,
        {
          subject : locals.subject,
          description : locals.description
        }
      )));

      it('Create form', it => {
        it('should have disappeared', () =>
          wrappers.driver.isNotVisible([
            selectors.topLevelPanel,
            selectors.accordion.main + `:first-child`
          ].join(' '), 2500)
        );
      });

      it('Get new item from DB', it => {
        it('should get item', () =>
          Item.findOne({ subject : locals.subject })
            .then(item => { locals.item = item })
        );

        it('should be an item', describe.use(() => isItem(locals.item, {
          type : locals.subtype._id,
          parent : locals.parent._id
        })));
      });

      it('Evaluation', it => {
        it('should be an evaluation view',
          describe.use(() => isEvaluationView(
            wrappers.driver,
            locals.item,
            {
              cursor : 1,
              limit : 1
            }
          ))
        );
      });

    }
  );
}

export default test;
