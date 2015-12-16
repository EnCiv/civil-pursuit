'use strict';

function deadlineOverdue (discussion) {
  return new Promise((ok, ko) => {

    if ( discussion.__original && discussion.__original.registered &&  discussion.registered.length > discussion.__original.registered.length ) {
      if ( Date.now() > +(discussion.deadline) ) {
        return ko(new Error('Discussion is closed'));
      }
    }

    ok();
  });
}

export default deadlineOverdue;
