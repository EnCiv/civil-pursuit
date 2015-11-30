'use strict';

import React                            from 'react';
import Layout                           from './layout';
import Profile                          from './profile';
import TermsOfService                   from './terms-of-service';
import Home                             from './home';
import ResetPassword                    from './reset-password';
import PanelItems                       from './panel-items';
import panelItemType                    from '../lib/proptypes/panel-item';

class App extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes  =   {
    path            :   React.PropTypes.string,
    item            :   panelItemType,
    panels          :   React.PropTypes.object
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {

    const {
      item,
      panels,
      path
    } = this.props;

    let page = ( <div></div> );

    let showIntro = true;

    if ( path === '/' ) {
      page = <Home { ...this.props } />;
    }

    const paths = path.split(/\//);

    paths.shift();

    switch ( paths[0] ) {
      case 'page':
        switch ( paths[1] ) {
          case 'profile':
            page = ( <Profile /> );
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
        const panelId1 = Object.keys(this.props.panels)[0];

        const panel = Object.assign({}, this.props.panels[panelId1]);

        panel.items = panel.items.filter(item => item.id === paths[1]);

        console.info({ panel })

        page = (
          <PanelItems { ...this.props } panel={ panel } />
        );

        break;

      case 'items':

        const panelId2 = Object.keys(this.props.panels)[0];

        page = (
          <PanelItems { ...this.props } panel={ this.props.panels[panelId2] } />
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
