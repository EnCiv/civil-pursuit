'use strict';

import React                            from 'react';
import Layout                           from './layout';
import Profile                          from './profile';
import TermsOfService                   from './terms-of-service';
import Home                             from './home';
import ResetPassword                    from './reset-password';
import PanelItems                       from './panel-items';
import panelItemType                    from '../lib/proptypes/panel-item';
import Panel                            from './panel';
import Icon                             from './util/icon';
import UserStore                        from './store/user';

class App extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {

    const {
      item,
      panels,
      path,
      user,
      intro,
      notFound,
      error
    } = this.props;

    console.info("App.render", this.props);

    let page = (
      <Panel heading={(<h4>Not found</h4>)} id="not-found">
        <section style={{ padding: 10 }}>
          <h4>Page not found</h4>
          <p>Sorry, this page was not found.</p>
        </section>
      </Panel>
    );

    let showIntro = false;

    console.info("app.render error:", error, error ? "true" : "false");

    if ( error ) {
      page = (
        <Panel heading={(<h4><Icon icon="bug" /> Error</h4>)}>
          <section style={{ padding: 10 }}>
            <h4 style={{ color : 'red', textAlign : 'center' }}>The system glitched :(</h4>
            <p style={{ textAlign : 'center' }}>We have encountered an error. We apologize for any inconvenience.</p>
          </section>
        </Panel>
      );
    }

    else {
      if ( path === '/' ) {
        page = <Home user={ user } />;
      }
      console.info ("app path before split", path);

      const paths = path.split(/\//);

      console.info ("app path", paths);

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
              page = (
                <UserStore user={ { activation_token : paths[2] } }>
                  <ResetPassword user={ user } />
                </UserStore>
              );
              showIntro = false;
              break;
          }
          break;

        case 'item':
          console.info("item:", paths[1]);

          const panelId1 = this.props.panels ? Object.keys(this.props.panels)[0] : 0;

          const panel = Object.assign({}, this.props.panels[panelId1]);

          panel.items = panel.items.filter(item => item.id === paths[1]);

          console.info("App.render item", { panel })

          page = (
            <PanelItems { ...this.props } panel={ panel } />
          );

          break;

        case 'items':

          const panelId2 = Object.keys(this.props.panels)[0];

          console.info("App.render items", { panelId2 });

          page = (
            <PanelItems { ...this.props } panel={ this.props.panels[panelId2] } />
          );
          break;
      }
    }

    return (
      <Layout intro={ showIntro ? intro : null } user={ user }>
        { page }
      </Layout>
    );
  }
}

export default App;
