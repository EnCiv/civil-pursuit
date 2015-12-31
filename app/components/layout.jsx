'use strict';

import React                          from 'react';
import TopBar                         from './top-bar';
import Footer                         from './footer';
import Panel                          from './panel';
import Intro                          from './intro';
import OffCanvas                      from './off-canvas';

class Layout extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes = {
    'show-intro' : React.PropTypes.bool
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let intro;

    if ( this.props['show-intro'] ) {
      intro = ( <Intro { ...this.props } /> );
    }

    return (
      <section>
        <TopBar { ...this.props } />
        <section role="main">
          {  intro }
          { this.props.children }
          <Footer />
          <OffCanvas />
        </section>
      </section>
    );
  }
}

export default Layout;
