'use strict';

import React              from 'react';
import Layout             from './layout';
import Stories            from './stories';
import Profile            from './profile';
import KitchenSink        from './kitchen-sink';
import TermsOfService     from './terms-of-service';
import Home               from './home';

class App extends React.Component {
  render () {
    let page = ( <div></div> );

    let showIntro = true;

    if ( this.props.path === '/' ) {
      page = <Home { ...this.props } />;
    }

    let paths = this.props.path.split(/\//);

    paths.shift();

    switch ( paths[0] ) {
      case 'page':
        switch ( paths[1] ) {
          case 'test':
            page = ( <Stories /> );
            showIntro = false;
            break;

          case 'profile':
            page = ( <Profile /> );
            showIntro = false;
            break;

          case 'kitchen-sink':
            page = ( <KitchenSink /> );
            showIntro = false;
            break;

          case 'terms-of-service':
            page = ( <TermsOfService /> );
            showIntro = false;
            break;
        }
        break;
    }

    return (
      <Layout { ...this.props } show-intro={ showIntro }>
        { page }
      </Layout>
    );
  }
}

export default App;
