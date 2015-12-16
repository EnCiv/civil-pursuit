'use strict';

function discussionNotStartedYet (discussion) {
  return new Promise((ok, ko) => {

    if ( discussion.__original && discussion.__original.registered &&  discussion.registered.length > discussion.__original.registered.length ) {
      if ( Date.now() < +(discussion.starts) ) {
        return ko(new Error('Discussion has not begun yet'));
      }
    }

    ok();
  });
}

export default discussionNotStartedYet;
