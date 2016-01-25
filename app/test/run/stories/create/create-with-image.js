'use strict';

import describe               from 'redtea';
import should                 from 'should';
import User                   from 'syn/../../dist/models/user';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import Item                   from 'syn/../../dist/models/item';
import identify               from 'syn/../../dist/test/util/e2e-identify';
import createItem             from 'syn/../../dist/test/util/e2e-create-item';
import selectors              from 'syn/../../selectors.json';
import isItem                 from 'syn/../../dist/test/is/item';
import isEvaluationView       from 'syn/../../dist/test/is/evaluation-view';
import Agent                  from 'syn/../../dist/lib/app/agent';
import emitter                from 'syn/../../dist/lib/app/emitter';

function test(props) {
  const locals = {
    subject : 'This is a subject',
    description : 'This is a description'
  };

  return testWrapper(
    'Story -> Create -> Create with image',
    {
      mongodb : true,
      http : { verbose : true },
      sockets : true,
      driver : true
    },
    wrappers => it => {

      it('Populate data', it => {
        it('User', it => {
          it('should create user', () =>
            User.lambda().then(user => { locals.user = user })
          )
        });
      });

      it('should go to home page', () =>
        wrappers.driver.client
          .url(`http://localhost:${wrappers.http.app.get('port')}`)
      );

      it('should sign in', describe.use(
        () => identify(wrappers.driver.client, locals.user)
      ));

      it('should click on close training', () => wrappers.driver.click(
        selectors.training.close, 5000
      ));

      it('should click on toggle button', () => wrappers.driver.client.click(
        selectors.create.toggle
      ));

      it('should download image', () => Agent.download(
        'https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg',
        '/tmp/syn-test-story-create-with-image.jpg'
      ));

      it('should create item', describe.use(() => createItem(
        wrappers.driver,
        '',
        {
          subject : locals.subject,
          description : locals.description,
          image : '/tmp/syn-test-story-create-with-image.jpg'
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

        it('should be an item', describe.use(() => isItem(locals.item)));

        it('should listen to updates', () => new Promise((ok, ko) => {
          let updated;

          const listener = item => {
            if ( item._id === locals.item._id.toString() ) {
              updated = true;
              wrappers.sockets.client.removeListener('item changed', listener);
              locals.item = item;
              ok();
            }
          };

          wrappers.sockets.client.on('item changed', listener);

          setTimeout(() => {
            if ( ! updated ) {
              ko(new Error('Time out waiting for image'));
            }
          }, 15000);
        }));
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

      it('Image is cloudinary', it => {
        locals.item.image.should.startWith('http://res.cloudinary.com/');
      });

      it('Image has updated in item box', () =>
        wrappers.driver.attributeMatches(
          `#item-${locals.item._id} > .item-media-wrapper img`,
          'src',
          locals.item.image
        )
      );

      it('Image has updated in evaluation', () =>
        wrappers.driver.attributeMatches(
          `#item-${locals.item._id} .item-promote [data-screen="phone-and-up"] .promote-left img`,
          'src',
          locals.item.image
        )
      );

      // describe.pause(15000)(it);

    }
  );
}

export default test;
