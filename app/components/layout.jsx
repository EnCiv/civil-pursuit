'use strict';

import React                          from 'react';
import TopBar                         from './top-bar';
import Footer                         from './footer';
import Panel                          from './panel';
import ReactScrollBar from './util/react-scrollbar';


class Layout extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const { user, setPath } = this.props;
    const myScrollbar = {
      width: 900,
      height: 1400,
    };

    return (
      <section>
        <div id="fb-root"></div>

        <TopBar user={ user } setPath={setPath} />
          <ReactScrollBar style={myScrollbar}>
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
