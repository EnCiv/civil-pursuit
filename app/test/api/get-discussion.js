'use strict';

import describe                   from '../../lib/util/describe';
import should                     from 'should';
import mock                       from '../mock';
import getDiscussion              from '../../api/get-discussion';
import isDiscussion               from '../../lib/assertions/discussion';
import Discussion                 from '../../models/discussion';

function test (props) {
  const locals = {};

  return describe ( ' API / Get Discussion', [
    {
      'Get discussion' : (ok, ko) => {
        mock(props.socket, getDiscussion, 'get discussion')
          .then(
            discussion => {
              locals.discussion = discussion;
              ok();
            },
            ko
          );
      }
    },
    {
      'should be a discussion' : (ok, ko) => {
        locals.discussion.should.be.a.discussion();
        ok();
      }
    }
  ]);
}

export default test;
