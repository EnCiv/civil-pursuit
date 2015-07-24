'use strict';

function getTitle (url) {
  return new Promise((ok, ko) => {
    this
      .publish('get url title', url)
      .subscribe((pubsub, title) => {
        ok(title);
        pubsub.unsubscribe();
      });
  });
}

export default getTitle;
