'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Loading from './util/loading';
import TypeComponent from './type-component';
import Panel from './panel';
import Instruction from './instruction';
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
    currentPanel: null,
    containerWidth: 0,
    panelStatus: ["issues"]
  };

  shared= {};

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
      if(this.state.currentPanel===null) return;
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
    if(this.state.currentPanel===null) return;   
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

  nextPanel(panelNum,status,results){
    let cP=this.state.currentPanel || 0;
    var panelStatus=this.state.panelStatus.slice(0);
    var newState=false;
    if(panelStatus[panelNum]!==status){panelStatus[panelNum]=status; newState=true}
    if(status !== 'done' && panelNum < (panelStatus.length-1)){  // if the panel is not done, mark all existing forward panels as that
      for(let i=panelNum+1; i< panelStatus.length; i++) if(panelStatus[i]!==status){panelStatus[i]=status; newState=true}
    }
    console.info("panelList nextPanel panelStatus")
    if(newState) {
      console.info("panelList nextPanel setting state")
      this.setState({panelStatus: panelStatus});
    }
    if(results){
      const shared=merge({},this.state.shared, results);
      console.info("panel-list shared");
      this.setState({shared: shared});
    }
    // advance to next panel if this was called by the current panel and it is done - other panels might call this with done
    if(status==='done' && panelNum === this.state.currentPanel && this.state.currentPanel<(this.state.typeList.length-1)){
      this.setState({currentPanel: this.state.currentPanel + 1 });
      this.smoothHeight();
    }
  }

 //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 panelListButton(i) {
   this.setState({currentPanel: i})
   if(this.state.currentPanel) this.smoothHeight();
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
      console.info("PanelList: type");
      console.info("PanelList: parent");

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
        if( this.state.panelStatus[i]==='done') { visible=true;}
        if( (i > 0) && this.state.panelStatus[i-1]==='done' ) { visible=true }
        let active= (this.state.currentPanel === i || (this.state.currentPanel === null && i===0));
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

    if (currentPanel !== null && this.state.typeList.length) {
/**        console.info("PanelList list: type", panel.type ? panel.type.name : "none");
        console.info("PanelList list: parent", panel.parent ? panel.parent.subject : "none");
        console.info("PanelList list: size", panel.limit || "none");
        console.info("PanelList list: own", panel.own || "none");
        console.info("PanelList list: typelist[",currentPanel,"]:",this.state.typeList[currentPanel].name);
        console.info("PanelList list: typelist[",currentPanel,"].component:",this.state.typeList[currentPanel].component);**/
        this.panelList[currentPanel].content=[(
                  <TypeComponent  component={this.state.typeList[currentPanel].component}
                                  parent={panel.parent} 
                                  type={this.state.typeList[currentPanel]} 
                                  user={this.props.user} 
                                  next={this.nextPanel.bind(this)} 
                                  shared={this.state.shared}
                                  emitter={this.props.emitter}
                                  panelNum={this.state.currentPanel}
                                  limit={panel.limit}
                  />  
      )];
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
            {  currentPanel!==null && this.panelList.length ? 
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
                []
            }
            </div>
          }
        </Panel>
      </section>
    );
  }
}

export default PanelList;
