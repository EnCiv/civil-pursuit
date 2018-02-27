'use strict';

import React from 'react';
import marked from 'marked';
import superagent from 'superagent';

class RenderMarkDown extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);
    let md=this.props.name;

    this.state = { text : '<h1>'+md+'</h1>' };

    this.get();
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  get () {
    if ( typeof window !== 'undefined' ) {
      superagent
        .get('/doc/'+this.props.name+'.md')
        .end((error, res) => {
          console.log('/doc/'+this.props.markDown+'.md', error, res);
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

export default RenderMarkDown;
