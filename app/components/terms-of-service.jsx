'use strict';

import React from 'react';
import marked from 'marked';
import superagent from 'superagent';

class TermsOfService extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);

    this.state = { text : '<h1>Terms of service</h1>' };

    this.get();
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  get () {
    if ( typeof window !== 'undefined' ) {
      superagent
        .get('/doc/terms-of-service.md')
        .end((error, res) => {
          console.log(error, res);
          if ( res.status === 200 ) {
            this.setState({ text : marked(res.text) });
          }
        });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    return (
      <section dangerouslySetInnerHTML={{ __html : this.state.text }}>
      </section>
    );
  }
}

export default TermsOfService;
