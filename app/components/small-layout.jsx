'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import TopBar                         from './top-bar';
import Footer                         from './footer';
import Panel                          from './panel';
import ReactScrollBar from './util/react-scrollbar';


class SmallLayout extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const { user, setPath } = this.props;
    const myScrollbar = {};

    return (
      <div class="syn-small-layout">
        <div id="fb-root"></div>
        <ReactScrollBar style={myScrollbar}>
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
