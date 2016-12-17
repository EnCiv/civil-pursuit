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
    training : null,
    typeList: []
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount () {
    console.info("panel-list.componentDidMount onServer=", typeof window !== 'undefined');
    if ( typeof window !== 'undefined' && this.props.panel.type.harmony) {
        window.socket.emit('get listo type', this.props.panel.type.harmony,  this.okGetListoType.bind(this))
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentdidUnmount () {
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  okGetListoType (typeList) {
    console.info("okGetListoType", typeList );
    this.setState({typeList: typeList});
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const content = [];
    let loading;
    let crumbs = [];
    let { typeList } = this.state;

    console.info("panelList state", this.state)

    if(typeList){ 
      typeList.forEach( type =>{
          crumbs.push(

              <div style={{display: "inline-block",
                          width: 100/typeList.length + "%",
                          padding: "0.5em",
                          border: "1px solid #666",
                          boxSizing: "border-box"
                          }}>
                {type.name}
              </div>
          )
      })

      crumbs=(
            <div style={{ display: "block",
                        marginBottom: "1em",
            }}>
              {crumbs}
            </div>
      )
    }

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

    return (<section>
              { crumbs }
              { content }
            </section>
            );
  }
}

export default PanelList;
