'use strict';

import React                        from 'react';
import Icon                         from './util/icon';
import Loading                      from './util/loading';
import Countdown                    from './countdown';
import QSortItems                   from './qsort-items';
import Training                     from './training';
import panelType                    from '../lib/proptypes/panel';
import PanelStore                   from './store/panel';
import Welcome                        from './welcome';

class QHome extends React.Component {

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
    this.setState({ panel : { type } });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  okGetTraining (training) {
    if ( training ) {
      this.setState({ training });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const content = [];
    let loading;

    const { discussion, panel, training } = this.state;


    if( ! this.props.user) {
      content.push(
        <Welcome />
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
              <QSortItems user={ this.props.user } />
            </PanelStore>
          </div>
        </div>
      );
    } else {
      content.push(
        <Loading message="Loading discussions ..." />
      );
    }

    return (<section>{ content }</section>);
  }
}

export default QHome;
