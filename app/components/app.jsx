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
import PanelList                        from './type-components/panel-list';
import TypeComponent                    from './type-component';
import OnlineDeliberationGame           from './odg';
import ODGCongrat         from './odg-congrat';
import fixedScroll                      from '../lib/util/fixed-scroll';

class App extends React.Component {

  state = { path: null}

  constructor (props) {
    super(props);

    if ( typeof window !== 'undefined' ) {
      if(!window.Synapp) {
        window.Synapp = {};
        Synapp.tendencyChoice = [];
        this.getTendency();
      }
      //window.onbeforeunload = this.confirmOnPageExit.bind(this);
      fixedScroll();
    }

    this.state.path = props.path ;
  }

  confirmOnPageExit(e) {
      // If we haven't been passed the event get the window.event
      e = e || window.event;

      var message = "If you are ready to end this discussion click Leave, your input has been saved and you can return at any time.\n\nIf you didn't mean to leave this discussion, click cancel Stay";

      // For IE6-8 and Firefox prior to version 4
      if (e) 
      {
          e.returnValue = message;
      }

      // For Safari, IE8+ and Opera 12+
      return message;

      //Chrome is not showing the message
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setPath(p) {
    //this.setState({ path: p});
    if(typeof window !== 'undefined') reactSetPath(p);
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

  componentDidMount(){
    //onsole.info("app componentDidMount", this.props.browserConfig);

    var topHTML = document.getElementsByTagName('html')[0];
    if(this.props.browserConfig.type==='phone') {
      topHTML.style.fontSize='8px';
    } else {
      topHTML.style.fontSize='13px';
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {

    const {
      item,
      panels,
      //path,
      user,
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
        page = <Home user={ user } path={path} />;
      }

      const paths = path.split(/\//);

      paths.shift();

      switch ( paths[0] ) {
        case 'page':
          switch ( paths[1] ) {
            case 'profile':
              page = ( <Profile /> );
              break;

            case 'terms-of-service':
              page = ( <TermsOfService /> );
              break;

            case 'about':
              page = ( <About /> );
              break;

            case 'reset-password':
              page = (
                <UserStore user={ { activation_token : paths[2] } }>
                  <ResetPassword user={ user } />
                </UserStore>
              );
              break;

          }
          break;

        case 'h':
          page = <Home user={ user } path={path} RASPRoot={'/h/'} />;
          break;
          
        case 'about':
              page = ( <About /> );
              break;

        case 'odg':
          if(user){
            page=(
                    <ODGCongrat { ...this.props }/>
                );
                break;
          }

          if(! this.props.panels) return(
            <OnlineDeliberationGame />
          );
          const keylist3 = Object.keys(this.props.panels);

          const panelId3 = keylist3[keylist3.length-1];

          const panel3 = Object.assign({}, this.props.panels[panelId3].panel);

          const component3=panel3.type.component || 'Subtype';

          return( <OnlineDeliberationGame component={component3} { ...this.props } count = { 1 } panel={ panel3 } />
                );

        case 'item':

          if(! this.props.panels) { break; }

          const keylist = Object.keys(this.props.panels);

          const panelId1 = keylist[keylist.length-1];

          const panel = Object.assign({}, this.props.panels[panelId1].panel);

          //panel.items = panel.items.filter(item => item.id === paths[1]);

          //console.info("app item panel filtered", panel );

          const component=panel.type.component || 'Subtype';

          page = (
            <TypeComponent component={component} { ...this.props } RASPRoot={'/item/'} user={ user } count = { 1 } panel={ panel } />
          );

          break;

        case 'items':
          if(! this.props.panels) { break; }

          const panelId2 = Object.keys(this.props.panels)[0];

          //onsole.info("App.render items", { panelId2 });

          const panel2 = Object.assign({}, this.props.panels[panelId2].panel);

          //panel.items = panel.items.filter(item => item.id === paths[1]);

          //console.info("app item panel filtered", panel );

          const component2=panel2.type.component || 'Subtype';
                    //onsole.info("App.render panel2", { panel2 });

          page = (
            <TypeComponent component={component2} { ...this.props } user={ user } count = { 1 } panel={ panel2 } />
          );

          break;
      }
    }

    return (
      <Layout user={ user } setPath={this.setPath.bind(this)} >
        { page }
      </Layout>
    );
  }
}

export default App;
