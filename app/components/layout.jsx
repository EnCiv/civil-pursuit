'use strict';

import React from 'react';
import TopBar from './top-bar';
import Footer from './footer';
import Panel from './panel';
import Intro from './intro';

class Layout extends React.Component {
  render () {
    let intro;

    if ( this.props['show-intro'] ) {
      intro = ( <Intro { ...this.props } /> );
    }

    return (
      <section>
        <TopBar { ...this.props } />
        {  intro }
        { this.props.children }
        <Footer />
      </section>
    );
  }
}

export default Layout;
