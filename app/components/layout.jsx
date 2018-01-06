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
    const myScrollbar = {};

    return (
      <section>
        <div id="fb-root"></div>

        <TopBar user={ user } setPath={setPath} />
          <ReactScrollBar style={myScrollbar}>
            <div className="should-have-a-chidren scroll-me">
              <section role="main">
                { this.props.children }
                <Footer />
              </section>
            </div>
        </ReactScrollBar>
      </section>
    );
  }
}

export default Layout;
