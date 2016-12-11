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
    this.stage = 'waiting for panel type';
 //   if ( typeof window !== 'undefined' ) {
 //       window.socket.emit('get panel type', this.okGetPanelType.bind(this))
 //   }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentdidUnmount () {
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  okGetPanelType (type) {
    this.setState({ panel : { type } });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const content = [];
    let loading;

    if(this.props.panel && this.props.panel.items) {

 //       const panel = {
 //           parent: this.props.panel.items[0],
 //           type: this.props.panel.items[0].subtype,
//            size: 100
//        }

        const panel = this.props.panel;
        
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
