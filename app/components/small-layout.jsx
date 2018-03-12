'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import TopBar                         from './top-bar';
import Footer                         from './footer';
import Panel                          from './panel';
import ReactScrollBar from './util/react-scrollbar';
import LogupBar                          from './logup-bar';


class SmallLayout extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const { user, setPath } = this.props;
    const myScrollbar = {};

    return (
      <div className="syn-small-layout">
        <div id="fb-root"></div>
          <LogupBar user={user} ref={e=>{this.topBar=e && e.getBannerNode()}} />
          <ReactScrollBar style={myScrollbar} topBar={this.topBar}>
              <div className="should-have-a-chidren scroll-me">
                  <section role="main">
                  { this.props.children }
                  <Footer />
                  </section>
              </div>
          </ReactScrollBar>
      </div>
    );
  }
}

export default SmallLayout;
