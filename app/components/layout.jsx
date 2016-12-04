'use strict';

import React                          from 'react';
import TopBar                         from './top-bar';
import Footer                         from './footer';
import Panel                          from './panel';
import HeaderMenu                     from './header-menu';

class Layout extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const { user, setPath } = this.props;

    return (
      <section>
        <div id="fb-root"></div>

        <TopBar user={ user } setPath={setPath} />

        <section role="main">

          { this.props.children }

          <Footer />

        </section>
      </section>
    );
  }
}

export default Layout;
