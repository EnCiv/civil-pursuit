'use strict';

import React from 'react';
import Icon from './util/icon';
import Loading from './util/loading';
import QSortItems from './qsort-items';
import panelType from '../lib/proptypes/panel';
import PanelStore from './store/panel';
import update from 'immutability-helper';
import TypeComponent from './type-component';

class PanelList extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  stage = 'loading';

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  state = {
    discussion: null,
    topLevelType: null,
    training: null,
    typeList: []
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount() {
    console.info("panel-list.componentDidMount onServer=", typeof window !== 'undefined');
    if (typeof window !== 'undefined' && this.props.panel.type.harmony) {
      window.socket.emit('get listo type', this.props.panel.type.harmony, this.okGetListoType.bind(this))
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentdidUnmount() {
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  okGetListoType(typeList) {
    console.info("okGetListoType", typeList);
    this.setState({ typeList: update(typeList, { $unshift: [this.props.panel.type] }) });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  nextPanel(){
    if(this.state.currentPanel<(this.state.typeList.length-1)){
      this.setState({currentPanel: this.state.currentPanel + 1});
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    const content = [];
    let loading;
    let crumbs = [];
    let { typeList } = this.state;

    console.info("panelList state", this.state)

    if (typeList) {
      typeList.forEach(type => {
        crumbs.push(

          <div style={{
            display: "inline-block",
            width: 100 / typeList.length + "%",
            padding: "0.5em",
            border: "1px solid #666",
            boxSizing: "border-box"
          }}>
            {type.name}
          </div>
        )
      })

      crumbs = (
        <div style={{
          display: "block",
          marginBottom: "1em",
        }}>
          {crumbs}
        </div>
      )
    }

    if (this.props.panel) {

      console.info("panel-list ptype", this.props.panel.type)

      const panel = this.props.panel;

      content.push(
        <div>
          <div id="top-level-panel">
            <PanelStore { ...panel }>
              <TypeComponent user={this.props.user} next={this.nextPanel.bind(this)} />
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
      {crumbs}
      {content}
    </section>
    );
  }
}

export default PanelList;
