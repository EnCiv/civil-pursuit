'use strict';

import React            from 'react';
import Row              from './util/row';
import Column           from './util/column';
import Image            from './util/image';

class Residence extends React.Component {
  render () {
    // return (
    //   <Row>
    //     <Column span="50">
    //       <Image src="http://res.cloudinary.com/hscbexf6a/image/upload/v1423262161/gvmv05rqke71uqsh3qzq.png" responsive />
    //     </Column>
    //
    //     <Column span="50">
    //       <h2>Residence</h2>
    //       <p>This information allows us to place you into the district, state, county, and city communities in which you belong. By using GPS validate - it provides a way to prevent people from impersonating a local resident.</p>
    //     </Column>
    //   </Row>
    // );

    return (
      <section>
        <section style={{ width: '50%', float : 'left' }}>
          <Image src="http://res.cloudinary.com/hscbexf6a/image/upload/v1423262161/gvmv05rqke71uqsh3qzq.png" responsive />
        </section>

        <section>
          <h2>Residence</h2>
          <p>This information allows us to place you into the district, state, county, and city communities in which you belong. By using GPS validate - it provides a way to prevent people from impersonating a local resident.</p>
        </section>
      </section>
    );
  }
}

export default Residence;
