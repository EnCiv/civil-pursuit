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
import About                            from './about';
import { EventEmitter }                 from 'events';

class App extends React.Component {

  state = { path: null}

  emitter = new EventEmitter();

  constructor (props) {
    super(props);

    if ( typeof window !== 'undefined' ) {
      if(!window.Synapp) {
        window.Synapp = {};
        Synapp.tendencyChoice = [];
        this.getTendency();
      }
    }

    this.state.path = props.path ;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setPath(p) {
    this.setState({ path: p});
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 getTendency () {
  Promise
    .all([
      new Promise((ok, ko) => {
        window.socket.emit('get political tendency', ok);
      })
    ])
    .then(
      results => {
        let [ politicalTendency ] = results;
        if(politicalTendency) {
            politicalTendency.forEach( choice => {
            window.Synapp.tendencyChoice[choice._id]=choice.name;
          } );
        }
      }
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {

    const {
      item,
      panels,
      //path,
      user,
      intro,
      notFound,
      error
    } = this.props;

    let path=this.state.path;

    let page = (
      <Panel heading={(<h4>Not found</h4>)} id="not-found">
        <section style={{ padding: 10 }}>
          <h4>Page not found</h4>
          <p>Sorry, this page was not found.</p>
        </section>
      </Panel>
    );

    let showIntro = false;


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

            case 'about':
              page = ( <About /> );
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
          
        case 'about':
              page = ( <About /> );
              showIntro = false;
              break;


        case 'item':

          if(! this.props.panels) { break; }

          const keylist = Object.keys(this.props.panels);

          const panelId1 = keylist[keylist.length-1];

          const panel = Object.assign({}, this.props.panels[panelId1].panel);

          //panel.items = panel.items.filter(item => item.id === paths[1]);

          //console.info("app item panel filtered", panel );

          page = (
            <PanelItems { ...this.props } user={ user } count = { 1 } panel={ panel } emitter = {this.emitter } />
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
      <Layout intro={ showIntro ? intro : null } user={ user } setPath={this.setPath.bind(this)} >
        { page }
      </Layout>
    );
  }
}

export default App;
