'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from 'redtea';
import testWrapper          from '../../../../lib/app/test-wrapper';
import isDiscussion         from '../../../../test/is/discussion';
import Discussion           from '../../../../models/discussion';

function test () {
  const locals = {};

  return testWrapper('Discussion Model > Find Current',
    {
      mongodb : true,
    },
    wrappers => it => {

      it('Empty - find nothing', it => {
        it('Find current',
          it => Discussion.findCurrent().then(discussion => {
            locals.discussion = discussion;
          })
        );

        it('No current discussion',
          () => should(locals.discussion).be.undefined()
        );
      });

      it('Find current one', it => {
        it('should create discussion',
          () => Discussion
            .create({
              subject : 'Test Discussion Model - Find Current',
              description : 'Test Discussion Model - Find Current -- Description',
              deadline : new Date(Date.now() + 2000),
              starts : new Date(),
              goal : 100
            })
            .then(discussion => { locals.discussion = discussion })
        );

        it('Find current',
          it => Discussion.findCurrent().then(found => {
            locals.found = found;
          })
        );

        it('should be a discussion', describe.use(() => isDiscussion(locals.found, locals.discussion)));
      });



      it('Discussion expired -- should not find it', it => {
        it('wait 2 seconds', () => new Promise(ok => setTimeout(ok, 2000)));

        it('Find current',
          it => Discussion.findCurrent().then(discussion => {
            locals.discussion = discussion;
          })
        );

        it('No current discussion',
          () => should(locals.discussion).be.undefined()
        );
      });

      it('Cannot find a discussion that has not started', it => {
        it('should create discussion',
          () => Discussion
            .create({
              subject : 'Test Discussion Model - Find Current',
              description : 'Test Discussion Model - Find Current -- Description',
              deadline : new Date(Date.now() + 999999),
              starts : new Date(Date.now() + 555555),
              goal : 100
            })
            .then(discussion => { locals.discussion = discussion })
        );

        it('Find current',
          it => Discussion.findCurrent().then(found => {
            locals.found = found;
          })
        );

        it('No current discussion',
          () => should(locals.found).be.undefined()
        );
      });

    }
  );
}

export default test;
