'use strict';

import React                        from 'react';
import Icon                         from './util/icon';
import Loading                      from './util/loading';
import Countdown                    from './countdown';
import PanelItems                   from './panel-items';
import Training                     from './training';
import panelType                    from '../lib/proptypes/panel';
import PanelStore                   from './store/panel';
import About                        from './about';

class Home extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  stage = 'loading';

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  state = {
    discussion : null,
    topLevelType : null,
    training : null
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount () {
    this.stage = 'waiting for discussion';

    if ( typeof window !== 'undefined' ) {
      window.socket.emit('get discussion', this.okGetDiscussion.bind(this));
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentdidUnmount () {
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  okGetDiscussion (discussion) {
    console.log('got discussion', discussion);
    if ( discussion ) {
      this.setState({ discussion });
    }
    else {
      window.socket
        .emit('get top level type', this.okGetTopLevelType.bind(this))
        .emit('get training', this.okGetTraining.bind(this));
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  okGetTopLevelType (type) {
    console.log('got top level type', type);
    this.setState({ panel : { type } });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  okGetTraining (training) {
    console.log('got training', training);
    if ( training ) {
      this.setState({ training });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const content = [];
    let loading;

    const { discussion, panel, items, training } = this.state;

    console.info("Home.render", this.props, this.state);

    var theCookies = document.cookie.split(';');

    console.info("home. cookies", theCookies, theCookies[synuser]);

    if( ! this.props.user) {
      content.push(
        <About />
      );
    }

    if ( discussion ) {
      const { deadline } = new Date(discussion);
      const now = Date.now();

      if ( now < deadline ) {
        content.push( <Countdown discussion={ discussion } { ...this.props } /> );
      }
    }

    else if ( panel ) {
      // const panel = this.props.panels[this.props.topLevelType];

      content.push(
        <div>
          <div id="top-level-panel">
            <PanelStore { ...panel }>
              <PanelItems user={ this.props.user } />
            </PanelStore>
          </div>
          <Training instructions={ training || [] } />
        </div>
      );
    } else {
      content.push(
        <Loading message="Loading discussions ..." />
      );
    }

    console.info("Home.render end", this.props, this.state, content);
    return (<section>{ content }</section>);
  }
}

export default Home;
