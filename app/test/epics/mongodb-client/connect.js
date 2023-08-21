'use strict';

import url                      from 'url';
import describe                 from 'redtea';
import Mungo                    from 'mungo';

const label = 'Connect new client to MongoDB';

export default props => describe => describe(label, it => {

  const locals = {};

  const parsed = url.parse(process.env.MONGODB_URI);

  parsed.pathname = '/syn_replaytest';

  it(`connect to ${url.format(parsed)}`,

    () => new Promise((ok, ko) => {

      Mungo

        .connect(url.format(parsed))

        .on('error', ko)

        .on('connected', db => {
          locals.mongodb = Mungo.connections[Mungo.connections.length - 1];
          ok();
        })

    })

  );

});
