'use strict';

import React                          from 'react';
import TopBar                         from './top-bar';
import Footer                         from './footer';
import Panel                          from './panel';
import ReactScrollBar from 'react-scrollbar-js';


class Layout extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const { user, setPath } = this.props;

    return (
      <section>
        <div id="fb-root"></div>

        <TopBar user={ user } setPath={setPath} />
          <ReactScrollBar>
            <section role="main">
              { this.props.children }
              <Footer />
            </section>
        </ReactScrollBar>
      </section>
    );
  }
}

export default Layout;
