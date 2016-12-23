'use strict';

import React from 'react';
import Icon from './util/icon';
import Loading from './util/loading';
import QSortItems from './qsort-items';
import panelType from '../lib/proptypes/panel';
import PanelStore from './store/panel';
import TypeComponent from './type-component';
import makePanel  from '../lib/app/make-panel';
import Panel from './panel';

class PanelList extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  stage = 'loading';

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  state = {
    discussion: null,
    topLevelType: null,
    training: null,
    typeList: [],
    currentPanel: 0
  };

  panelList = [];
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
    for(let i=0; i< typeList.length; i++) { this.panelList[i]={content: [] }; }
    this.setState({ typeList: typeList});
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  nextPanel(){
    if(this.state.currentPanel<(this.state.typeList.length-1)){
      this.setState({currentPanel: this.state.currentPanel + 1});
    }
  }

 //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 panelListButton(i) {
   this.setState({currentPanel: i})
 }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    const content = [];
    let loading;
    let crumbs = [];
    let { typeList } = this.state;
    const panel= this.props.panel;
    var title, name;
    const currentPanel=this.state.currentPanel;

    if ( panel ) {

      if(panel.type) {
        name = `syn-panel-list--${panel.type._id || panel.type}`;
        title = panel.type.name;
      } else
      { name = 'syn-panel-list-no-type';
        title = 'untitled';
      }

      if ( panel.parent ) {
        name += `-${panel.parent._id || panel.parent}`;
      }
    }

    console.info("panelList state", this.state)

    if (typeList) {
      typeList.forEach((type, i) => {
        crumbs.push(
          <button onClick={this.panelListButton.bind(this, i)} style={{
            display: "inline",
            padding: "0.5em",
            border: "1px solid #666",
            boxSizing: "border-box",
            backgroundColor: this.state.currentPanel == i ? "#eee" : "#ddd"
          }}>
            {type.name}
          </button>
        )
      })

      crumbs = (
        <div style={{
          display: "block",
          marginBottom: "1em",
          marginTop: "1em",
        }}>
          {crumbs}
        </div>
      )
    }

    if (this.state.typeList.length) {

      console.info("panel-list ptype", this.state)

      console.info("PanelList panel", currentPanel, this.panelList);

      if(this.panelList[currentPanel].content.length==0 ){
        console.info("PanelList", panel, this.state.typeList[currentPanel]);
        this.panelList[currentPanel].content= (
                  <PanelStore { ...panel }>
                    <TypeComponent component={this.state.typeList[currentPanel].component} type={this.state.typeList[currentPanel]} user={this.props.user} next={this.nextPanel.bind(this)} />  
                  </PanelStore>
        );
      }
    }

    return (<section>
        <Panel
          className   =   { name }
          ref         =   "panel"
          heading     =   {[( <h4>{ title }</h4> )]}
          >
      {crumbs}
      {this.panelList.length ? 
          this.panelList.map((panelListItem, i) => {
            return(
              <div id={`panel-list-${i}`} 
                   style={{
                            left: (((i - currentPanel) * 100) + 'vw'),
                            transition: "all 0.5s linear",
                            position: "relative"
                          }} 
              >
                { panelListItem.content }
              </div>
              );
           }) 
        : 
          <Loading message="Loading discussions ..." />
      }
      </Panel>
    </section>
    );
  }
}

export default PanelList;
