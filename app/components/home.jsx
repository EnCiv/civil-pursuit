'use strict';

import React                        from 'react';
import Component                    from '../lib/app/component';
import Icon                         from './util/icon';
import Countdown                    from './countdown';
import TopLevelPanel                from './top-level-panel';

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

      else {
        content = <TopLevelPanel { ...this.props} />
      }
    }

    return content;
  }
}

export default Home;
