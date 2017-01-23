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
import Instruction from './instruction';
import QVoteStore from './store/qvote';
import merge from 'lodash/merge'

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
  panelStatus=[];

  stepRate=25; //ms
  inHeight='inactive';
  observer=null

  panelList = [];
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount() {
    if (typeof window !== 'undefined' && this.props.panel.type.harmony) {
      window.socket.emit('get listo type', this.props.panel.type.harmony, this.okGetListoType.bind(this))
    }
    this.setState({
        containerWidth: ReactDOM.findDOMNode(this.refs.panel).clientWidth
      });
    this.observer = new MutationObserver( this.mutations.bind(this) );
  }



    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  componentWillUnmount() {
    this.observer.disconnect();
  }
  
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  mutations(mutations){
      if(this.inHeight==='active') return;
      let outer = this.refs.outer;
      if(!this.refs['panel-list-'+this.state.currentPanel]) return;
      let inner = ReactDOM.findDOMNode(this.refs['panel-list-'+this.state.currentPanel]);
      if(!(inner)) return;
      let outerHeight= outer.clientHeight;
      let innerHeight= inner.clientHeight;
      let outerMaxHeight = parseInt(outer.style.maxHeight,10) || 0;
      if(outerHeight != innerHeight || outerMaxHeight != innerHeight){
        this.smoothHeight();
      }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidUpdate() {
    let pi='panel-list-'+this.state.currentPanel;
    let target = ReactDOM.findDOMNode(this.refs.panel);
    if(this.state.containerWidth != target.clientWidth){  // could be changed by resizing the window
      this.setState({
          containerWidth: target.clientWidth
        });
    }
    this.observer.observe(target,{attributes: true, childList: true, subtree: true});
  }

 //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   smoothHeight() {
    // set an interval to update scrollTop attribute every 25 ms
    if(this.inHeight=='active'){return;} //don't stutter the close

    this.inHeight='active';

    let outer = this.refs.outer;


    let timerMax= parseInt(2000/this.stepRate,10); 

    
    const timer = setInterval( () => {
      if(--timerMax <= 0 ){ clearInterval(timer);  this.inHeight='inactive'; return; }
      if(!this.refs['panel-list-'+this.state.currentPanel]){ // when this happens it's a bug in the parent, but don't let it overload the console with error messages.
        console.error('PanelList.smoothHeight: refs[] does not exist:', 'panel-list-'+this.state.currentPanel); 
        clearInterval(timer);  this.inHeight='inactive';
        return;
      }
      let inner = ReactDOM.findDOMNode(this.refs['panel-list-'+this.state.currentPanel]);
      let outerHeight= outer.clientHeight;
      let innerHeight= inner.clientHeight;
      let outerMaxHeight = parseInt(outer.style.maxHeight,10) || 0;
      if(outerHeight != innerHeight || outerMaxHeight != innerHeight){
        outer.style.maxHeight=innerHeight + 'px';
      }
    }, this.stepRate);
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  okGetListoType(typeList) {
    for(let i=0; i< typeList.length; i++) { this.panelList[i]={content: [] }; }
    this.setState({ typeList: typeList});
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  nextPanel(results){
    let cP=this.state.currentPanel;
    if(!this.panelStatus[cP]) { this.panelStatus[cP]={} }
    this.panelStatus[cP].done=true;
    if(results){
      const shared=merge({},this.state.shared, results);
      console.info("panel-list shared", shared);
      this.setState({shared: shared});
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
    let instruction = []
    let loading;
    let crumbs = [];
    let { typeList } = this.state;
    const panel= this.props.panel;
    var title, name;
    const currentPanel=this.state.currentPanel;
    const containerWidth=this.state.containerWidth;
    const spaceBetween=containerWidth * 0.25;

    if ( panel ) {
      console.info("PanelList: type", panel.type ? panel.type.name : "none");
      console.info("PanelList: parent", panel.parent ? panel.parent.subject : "none");

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

    if (panel.type && panel.type.instruction) {
        instruction = (
            <Instruction >
                {panel.type.instruction}
            </Instruction>
        );
    }

    if (typeList) {
      typeList.forEach((type, i) => {
        let visible= false;
        if( this.panelStatus[i] && this.panelStatus[i].done) { visible=true;}
        if( (i > 0) && this.panelStatus[i-1] && this.panelStatus[i-1].done ) { visible=true }
        let active= this.state.currentPanel === i;
        let buttonActive= active || visible;
        crumbs.push(
          <button onClick={buttonActive ? this.panelListButton.bind(this, i) : null}
          className ={ !(active || visible) ? 'inactive' : ''}
           style={{
            display: "inline",
            padding: "0.5em",
            border: "1px solid #666",
            boxSizing: "border-box",
            backgroundColor: active ? "#000" : visible ? "#fff" : "#fff",
            color: active ? "#fff" : visible ? "#000" : null
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
        console.info("PanelList list: type", panel.type ? panel.type.name : "none");
        console.info("PanelList list: parent", panel.parent ? panel.parent.subject : "none");
        console.info("PanelList list: size", panel.size || "none");
        console.info("PanelList list: own", panel.own || "none");
        console.info("PanelList list: typelist[",currentPanel,"]:",this.state.typeList[currentPanel].name);
        console.info("PanelList list: typelist[",currentPanel,"].component:",this.state.typeList[currentPanel].component);
        if(currentPanel===0){
          this.panelList[currentPanel].content=[(
                <PanelStore { ...panel }>
                  <QVoteStore>
                    <TypeComponent component={this.state.typeList[currentPanel].component} 
                                  type={this.state.typeList[currentPanel]} 
                                  user={this.props.user} 
                                  next={this.nextPanel.bind(this)} 
                                  shared={this.state.shared}
                                  emitter={this.props.emitter}
                    />
                  </QVoteStore>
                </PanelStore>
          )];
        } else {
           this.panelList[currentPanel].content=[(
                      <TypeComponent component={this.state.typeList[currentPanel].component} 
                                    type={this.state.typeList[currentPanel]} 
                                    user={this.props.user} 
                                    next={this.nextPanel.bind(this)} 
                                    shared={this.state.shared}
                                    emitter={this.props.emitter}
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
          {instruction}
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
