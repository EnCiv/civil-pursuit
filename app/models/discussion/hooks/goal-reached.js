'use strict';

function goalReached (discussion) {
  return new Promise((ok, ko) => {
    if ( discussion.registered.length > discussion.goal ) {
      return ko(new Error('Goal already achieved'));
    }
    ok();
  });
}

export default goalReached;
