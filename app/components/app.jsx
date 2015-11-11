'use strict';

import React              from 'react';
import Layout             from './layout';
import Stories            from './stories';
import Profile            from './profile';
import KitchenSink        from './kitchen-sink';
import TermsOfService     from './terms-of-service';
import Home               from './home';
import ResetPassword      from './reset-password';
import PanelItems         from './panel-items';
import panelItemType      from '../lib/proptypes/panel-item';

class App extends React.Component {

  static propTypes = {
    path : React.PropTypes.string,
    item : panelItemType
  }

  render () {

    console.log('-------------------------------------------------------------')
    console.log('app', { props : this.props })
    console.log('-------------------------------------------------------------')

    const { path, item } = this.props;

    let page = ( <div></div> );

    let showIntro = true;

    if ( this.props.path === '/' ) {
      page = <Home { ...this.props } />;
    }

    let paths = path.split(/\//);

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

          case 'reset-password':
            page = ( <ResetPassword { ...this.props } /> );
            showIntro = false;
            break;
        }
        break;

      case 'item':
        const panel =   {
          panel     :   {
            type    :   item.type,
            parent  :   item.parent
          },
          items     :   [item]
        };

        console.log('---------------------------------------------------------')

        console.log({ panel });

        console.log('---------------------------------------------------------')

        page = (
          <PanelItems { ...this.props } panel={ panel } />
        );
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
