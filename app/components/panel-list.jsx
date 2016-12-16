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

class PanelList extends React.Component {

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
    if ( typeof window !== 'undefined' && this.propls.panel.type.harmony) {
        window.socket.emit('get list of type', this.props.panel.type.harmony,  this.okGetListOfType.bind(this))
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentdidUnmount () {
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  okGetListOfType (typeList) {
    console.info("okGetListOfType", typeList );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const content = [];
    let loading;



    if(this.props.panel && this.props.panel.items) {

        console.info("panel-list ptype", this.props.panel.type)

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

export default PanelList;
