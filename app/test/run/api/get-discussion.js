'use strict';

import describe                   from 'redtea';
import should                     from 'should';
import testWrapper                from '../../../lib/app/test-wrapper';
import mock                       from '../../../lib/app/socket-mock';
import getDiscussion              from '../../../api/get-discussion';
import isDiscussion               from '../../is/discussion';
import Discussion                 from '../../../models/discussion';
import reset                      from '../../../bin/reset';

function test (props) {
  const locals = {};

  return testWrapper(
    ' API / Get Discussion',
    {
      mongodb : true,
      http : true,
      sockets : true
    },
    wrappers => it => {

      it('No current discussion', [ it => {
        it('Get discussion', () => new Promise((ok, ko) => {
          getDiscussion
            .apply(
              wrappers.sockets.apiClient,
              [discussion => { locals.discussion = discussion; ok() }]
            );
        }));

        it('should be no discussion', (ok, ko) => {
          should(locals.discussion).be.undefined();
        });
      }]);

      it('Current discussion', [ it => {
        it('should create a current discussion', () => new Promise((ok, ko) => {
          Discussion.create({
            subject : 'Test discussion',
            description : 'Test discussion description',
            goal : 10,
            starts : new Date(),
            deadline : new Date(Date.now() + 1000 * 5)
          }).then(ok,ko);
        }));

        it('should find current', () => new Promise((ok, ko) => {
          getDiscussion
            .apply(
              wrappers.sockets.apiClient,
              [discussion => { locals.discussion = discussion; ok() }]
            );
        }));

        it('should be a discussion', describe.use(() => isDiscussion(locals.discussion)));
      }]);

      it('No more current discussion', [ it => {
        it('put deadline to past', () => new Promise((ok, ko) => {
          locals.discussion
            .set('deadline', Date.now())
            .save()
            .then(() => setTimeout(ok, 1500))
            .catch(ko);
        }));

        it('Get discussion', () => new Promise((ok, ko) => {
          getDiscussion
            .apply(
              wrappers.sockets.apiClient,
              [discussion => { locals.discussion = discussion; ok() }]
            );
        }));

        it('should be no discussion', (ok, ko) => {
          should(locals.discussion).be.undefined();
        });
      }]);
    }
  );
}

export default test;
