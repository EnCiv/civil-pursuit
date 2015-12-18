'use strict';

import describe                   from 'redtea';
import should                     from 'should';
import mock                       from '../../lib/app/socket-mock';
import getDiscussion              from '../../api/get-discussion';
import isDiscussion               from '../.test/assertions/is-discussion';
import Discussion                 from '../../models/discussion';
import reset                      from '../../bin/reset';

function test (props) {
  const locals = {};

  return describe ( ' API / Get Discussion', it => {

    it('No current discussion', [ it => {
      it('should reset all discussions', () => reset('discussion'));

      it('Get discussion', () => new Promise((ok, ko) => {
        mock(props.socket, getDiscussion, 'get discussion')
          .then(
            discussion => {
              locals.discussion = discussion;
              ok();
            },
            ko
          );
      }));

      it('should be no discussion', (ok, ko) => {
        should(locals.discussion).be.null();
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
        mock(props.socket, getDiscussion, 'get discussion')
          .then(
            discussion => {
              locals.discussion = discussion;
              ok();
            },
            ko
          );
      }));

      it('should be a discussion', describe.use(() => isDiscussion(locals.discussion)));
    }]);

    it('No more current discussion', [ it => {
      it('put deadline to past', () => new Promise((ok, ko) => {
        locals.discussion.set('deadline', new Date(Date.now() - 50000))
          .save().then(ok, ko);
      }));

      it('Get discussion', () => new Promise((ok, ko) => {
        mock(props.socket, getDiscussion, 'get discussion')
          .then(
            discussion => {
              locals.discussion = discussion;
              ok();
            },
            ko
          );
      }));

      it('should be no discussion', (ok, ko) => {
        should(locals.discussion).be.null();
      });
    }]);
  });
}

export default test;
