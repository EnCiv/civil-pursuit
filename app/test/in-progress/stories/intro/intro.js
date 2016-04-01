'use strict';

import describe               from 'redtea';
import should                 from 'should';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import selectors              from 'syn/../../selectors.json';
import Type                   from 'syn/../../dist/models/type';
import Item                   from 'syn/../../dist/models/item';

function test(props) {
  const locals = {};

  return testWrapper(
    'Story -> Intro',
    { mongodb : true, http : { verbose : true }, driver : true },
    wrappers => it => {

      it('Fetch data', it => {
        it('Intro type', it => {
          it('should get intro type', () =>
            Type.findOne({ name : 'Intro' })
              .then(type => { locals.type = type })
          );
        });

        it('Intro item', it => {
          it('should get intro item', () =>
            Item.findOne({ type : locals.type })
              .then(intro => { locals.intro = intro })
          );
        });
      });

      it('should go to home page', () =>
        wrappers.driver.client
          .url(`http://localhost:${wrappers.http.app.get('port')}`)
      );

      it('should see Intro panel', () => wrappers.driver.isVisible(
        selectors.intro, 2500
      ));

      it('should have the right subject as panel title', () => wrappers.driver.hasText(
        selectors.intro + ' ' + selectors.panel.heading,
        locals.intro.subject
      ));

      it('should have the right subject', () => wrappers.driver.hasText(
        selectors.intro + ' ' + selectors.item.subject,
        locals.intro.subject
      ));

      it('should click on read more', () => wrappers.driver.client.click(
        selectors.intro + ' ' + selectors.item.read.more
      ));

      describe.pause(1500)(it);

      it('should have the right description', () => wrappers.driver.hasText(
        selectors.intro + ' ' + selectors.item.description,
        locals.intro.description.replace(/\n\n/g, '\n')
      ));

    }
  );
}

export default test;
