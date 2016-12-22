'use strict';

import React from 'react';
import Icon from './util/icon';
import Loading from './util/loading';
import QSortItems from './qsort-items';
import panelType from '../lib/proptypes/panel';
import PanelStore from './store/panel';
import TypeComponent from './type-component';
import makePanel  from '../lib/app/make-panel';

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
    for(let i=0; i< typeList.length; i++) { this.panelList[i]={content: {} }; }
    this.setState({ typeList: typeList});
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
    const panel=makePanel(this.props.panel);

    console.info("panelList state", this.state)

    if (typeList) {
      typeList.forEach(type => {
        crumbs.push(

          <div style={{
            display: "inline",
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

    if (this.state.typeList.length) {

      console.info("panel-list ptype", this.state)
      var currentPanel=this.state.currentPanel;

      console.info("PanelList panel", currentPanel, this.panelList);

      if(!this.panelList[currentPanel].content ){
        this.panelList[currentPanel].content= (currentPanel)=>{
            const cp=currentPanel; //doing this through a function so that cp can be a constant that doesn't change for this element, even after currentPanel changes to prevent unnecessary rerendering
            return(
              <div id="panel-list" style={{left: (cp - this.state.currentPanel) * 100 + "vw",
                                          transition: "all 0.5s linear",
                                          position: "relative" }} >
                  <PanelStore { ...panel }>
                    <TypeComponent component={this.panelList[cp].component} type={this.state.typeList[cp]} user={this.props.user} next={this.nextPanel.bind(this)} />  
                  </PanelStore>
              </div>
            );
        }
      }
    }

    return (<section>
      {crumbs}
      {this.panelList.length ? 
          this.panelList.map(panelListItem => {
            return(panelListItem.content);
           }) 
        : 
          <Loading message="Loading discussions ..." />
      }
    </section>
    );
  }
}

export default PanelList;
