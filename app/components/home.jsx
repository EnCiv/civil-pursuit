'use strict';

import React                        from 'react';
import Component                    from '../lib/app/component';
import Icon                         from './util/icon';
import Countdown                    from './countdown';
import PanelItems                   from './panel-items';
import Training                     from './training';

class Home extends React.Component {
  constructor (props) {
    super(props);

    this.state = { discussion : null };

    this.get();
  }

  get () {
    if ( typeof window !== 'undefined' ) {
      window.socket.emit('get discussion')
        .on('OK get discussion', discussion => this.setState({ discussion }));
    }
  }

  render () {

    let content = (
      <div className={ Component.classList(this, 'text-center', 'gutter', 'muted') }>
        <Icon icon="circle-o-notch" spin={ true } size={ 4 } />
      </div>
    );

    if ( this.state.discussion ) {
      let { deadline } = new Date(this.state.discussion);
      let now = Date.now();

      if ( now < deadline ) {
        content = ( <Countdown discussion={ this.state.discussion } { ...this.props } /> );
      }

      else if ( this.props.topLevelType ) {
        let panel = this.props.panels[this.props.topLevelType];

        content = (
          <div>
            <div id="top-level-panel">
              <PanelItems panel={ panel } { ...this.props } />
            </div>
          </div>
        );
      }
    }

    return content;
  }
}

export default Home;
