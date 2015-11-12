'use strict';

import React                        from 'react';
import Component                    from '../lib/app/component';
import Icon                         from './util/icon';
import Loading                      from './util/loading';
import Countdown                    from './countdown';
import PanelItems                   from './panel-items';
import Training                     from './training';
import panelType                    from '../lib/proptypes/panel';

class Home extends React.Component {

  static propTypes  =   {
    topLevelType    :   React.PropTypes.string,
    panels          :   React.PropTypes.object
  }

  state = {
    discussion : null
  }

  constructor (props) {
    super(props);

    this.get();
  }

  get () {
    if ( typeof window !== 'undefined' ) {
      window.socket.emit('get discussion')
        .on('OK get discussion', discussion => this.setState({ discussion }));

      window.socket.emit('get top level type');
    }
  }

  render () {

    let content = (
      <Loading message="Loading issues..." />
    );

    if ( this.state.discussion ) {
      const { deadline } = new Date(this.state.discussion);
      const now = Date.now();

      if ( now < deadline ) {
        content = ( <Countdown discussion={ this.state.discussion } { ...this.props } /> );
      }

      else if ( this.props.topLevelType ) {
        const panel = this.props.panels[this.props.topLevelType];

        content = (
          <div>
            <div id="top-level-panel">
              <PanelItems panel={ panel } { ...this.props } />
            </div>

            <Training { ...this.props } />
          </div>
        );
      }
    }

    return content;
  }
}

export default Home;
