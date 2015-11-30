'use strict';

function mock (client, method, event, ...messages) {
  return new Promise((ok, ko) => {
    try {
      const onError = error => ko(error);

      method.apply(client, [event, ...messages]);

      client
        .on('error', onError)
        .on(`OK ${event}`, (...messages) => {

          client.removeListener('error', onError);

          ok(...messages);

        });
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default mock;
