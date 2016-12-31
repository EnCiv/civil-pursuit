'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
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
    currentPanel: 0,
    containerWidth: 0,
  };

  shared= {};

  stepRate=25; //ms
  inHeight='inactive';

  panelList = [];
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount() {
    console.info("panel-list.componentDidMount onServer=", typeof window !== 'undefined');
    if (typeof window !== 'undefined' && this.props.panel.type.harmony) {
      window.socket.emit('get listo type', this.props.panel.type.harmony, this.okGetListoType.bind(this))
    }
    this.setState({
        containerWidth: ReactDOM.findDOMNode(this.refs.panel).clientWidth
      });
    }
  

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidUpdate() {
    let pi='panel-list-'+this.state.currentPanel;
    if(this.state.containerWidth != ReactDOM.findDOMNode(this.refs.panel).clientWidth){  // could be changed by resizing the window
      this.setState({
          containerWidth: ReactDOM.findDOMNode(this.refs.panel).clientWidth
        });
    }
  }

 //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   smoothHeight() {
    // set an interval to update scrollTop attribute every 25 ms
    if(this.inHeight=='active'){return;} //don't stutter the close
    this.inHeight='active';

    let outer = this.refs.outer;

    let timerMax= parseInt(2000/this.stepRate,10); 
    console.info("smoothHeight");
    
    const timer = setInterval( () => {
      if(--timerMax <= 0 ){ clearInterval(timer);  this.inHeight='inactive'; return; }
      let inner = this.refs['panel-list-'+this.state.currentPanel];
      let outerHeight= outer.clientHeight;
      let innerHeight= inner.clientHeight;
      let outerMaxHeight = parseInt(outer.style.maxHeight,10) || 0;
      if(outerHeight != innerHeight || outerMaxHeight != innerHeight){
        outer.style.maxHeight=innerHeight + 'px';
      }
      console.info("smoothHeight", outerHeight, outerMaxHeight, innerHeight);
    }, this.stepRate);
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  okGetListoType(typeList) {
    console.info("okGetListoType", typeList);
    for(let i=0; i< typeList.length; i++) { this.panelList[i]={content: [] }; }
    this.setState({ typeList: typeList});
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  nextPanel(results){
    if(results){
      this.setState({shared: Object.assign({}, this.state.shared, results)});
    }
    if(this.state.currentPanel<(this.state.typeList.length-1)){
      this.setState({currentPanel: this.state.currentPanel + 1 });
      this.smoothHeight();
    }
  }

 //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 panelListButton(i) {
   this.setState({currentPanel: i})
   this.smoothHeight();
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
    const containerWidth=this.state.containerWidth;
    const spaceBetween=containerWidth * 0.25;

    console.info("panelList containerWidth", containerWidth);

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
            backgroundColor: this.state.currentPanel == i ? "#fff" : "#ddd"
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
          textAlign: "center"
        }}>
          {crumbs}
        </div>
      )
    }

    if (this.state.typeList.length) {

      console.info("panel-list ptype", this.state)

      console.info("PanelList panel", currentPanel, this.panelList);


        console.info("PanelList", panel, this.state.typeList[currentPanel]);

        if(currentPanel===0){
          this.panelList[currentPanel].content=[(
                    <PanelStore { ...panel }>
                      <TypeComponent component={this.state.typeList[currentPanel].component} 
                                    type={this.state.typeList[currentPanel]} 
                                    user={this.props.user} 
                                    next={this.nextPanel.bind(this)} 
                                    shared={this.state.shared}
                      />  
                    </PanelStore>
          )];
        } else {
           this.panelList[currentPanel].content=[(
                      <TypeComponent component={this.state.typeList[currentPanel].component} 
                                    type={this.state.typeList[currentPanel]} 
                                    user={this.props.user} 
                                    next={this.nextPanel.bind(this)} 
                                    shared={this.state.shared}
                      />  
          )];
        }
    }

    return(
      <section>
        <Panel
          className   =   { name }
          ref         =   "panel"
          heading     =   {[( <h4>{ title }</h4> )]}
          >
          {crumbs}
          {
            <div ref='outer'>
            {  this.panelList.length ? 
                  <div id='panel-list-wide' 
                        style={{
                          width: (containerWidth + spaceBetween)* this.panelList.length + 'px',
                          left:  -currentPanel * (containerWidth + spaceBetween) + 'px',
                          transition: "all 0.5s linear",
                          position: "relative"
                        }} 
                  >
                    {  this.panelList.map( (panelListItem, i) => {
                        if(panelListItem.content.length) {
                          return(
                            <div  id={`panel-list-${i}`}
                                  ref={`panel-list-${i}`}
                                  style={{display: "inline-block",
                                          verticalAlign: 'top',
                                          marginRight: spaceBetween + 'px',
                                          width: containerWidth + 'px'}}
                            >
                              { panelListItem.content }
                            </div>
                          );
                        } else 
                        { return ([]);
                        }
                      })
                    }
                  </div>
              : 
                <Loading message="Loading discussions ..." />
            }
            </div>
          }
        </Panel>
      </section>
    );
  }
}

export default PanelList;
