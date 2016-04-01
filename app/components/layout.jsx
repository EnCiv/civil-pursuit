'use strict';

import React                          from 'react';
import TopBar                         from './top-bar';
import Footer                         from './footer';
import Panel                          from './panel';
import Intro                          from './intro';
import HeaderMenu                     from './header-menu';

class Layout extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const { intro, user } = this.props;

    return (
      <section>
        <div id="fb-root"></div>

        <TopBar user={ user } />

        <section role="main">
          { intro ? ( <Intro intro={ intro } /> ) : ''}

          { this.props.children }

          <Footer />

          <HeaderMenu />
        </section>
      </section>
    );
  }
}

export default Layout;
