'use strict';

import React            from 'react';
import Row              from './util/row';
import Column           from './util/column';
import Image            from './util/image';
import Icon             from './util/icon';
import Button           from './util/button';

class Residence extends React.Component {
  render () {
    return (
      <section>
        <section style={{ width: '50%', float : 'left' }}>
          <Image src="http://res.cloudinary.com/hscbexf6a/image/upload/v1423262161/gvmv05rqke71uqsh3qzq.png" responsive />
        </section>

        <section>
          <h2>Residence</h2>
          <p>This information allows us to place you into the district, state, county, and city communities in which you belong. By using GPS validate - it provides a way to prevent people from impersonating a local resident.</p>
        </section>

        <Row>
          <Column span="50">
            <Icon icon="exclamation-circle" /> Not yet validated!
          </Column>
          <Column span="50">
            <Button>Validate GPS</Button>
          </Column>
        </Row>
      </section>
    );
  }
}

export default Residence;
