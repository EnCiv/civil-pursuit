'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Loading from '../util/loading';
import TypeComponent from '../type-component';
import Panel from '../panel';
import Instruction from '../instruction';
import merge from 'lodash/merge';
import { ReactActionStatePath, ReactActionStatePathMulti } from 'react-action-state-path';
import PanelHead from '../panel-head';

class PanelList extends React.Component {
  initialRASP={currentPanel: 0};
  render() {
    //onsole.info("PanelList.render", this.props);
    return (
      <PanelHead {...this.props} cssName={'syn-panel-list'} >
        <ReactActionStatePath initialRASP={this.initialRASP}>
          <RASPPanelList />
        </ReactActionStatePath>
      </PanelHead>
    );
  }
}

class RASPPanelList extends ReactActionStatePathMulti {

  constructor(props) {
    console.log("RASPPanelList.constructor", props);
    super(props, 'currentPanel', 1);
    if (this.props.rasp.toParent) {
      this.props.rasp.toParent({ type: "SET_TO_CHILD", function: this.toMeFromParent.bind(this), name: this.constructor.name, actionToState: this.actionToState.bind(this), clientThis: this })
    } else console.error("RASPPanelList no rasp.toParent", this.props);
    this.panelStatus=[];
    this.createDefaults();
  }

  actionToState(action, rasp, source) {
    //find the section that the itemId is in, take it out, and put it in the new section
    var nextRASP = {}, delta = {};
    var panelStatus = this.panelStatus;
    if(action.type==="NEXT_PANEL") {
      const {currentPanel, status='done', results}=action; 
      var currentPanel=currentPanel;
      let newStatus=false;
      if (panelStatus[currentPanel] !== status) { panelStatus[currentPanel] = status; newStatus = true }
      if (status !== 'done' && currentPanel < (panelStatus.length - 1)) {  // if the panel is not done, mark all existing forward panels as that
        for (let i = currentPanel + 1; i < panelStatus.length; i++) if (panelStatus[i] !== status) { panelStatus[i] = status; newStatus = true }
      }
      //if (newStatus) this.panelStatus=panelStatus;
      if (results) this.shared = merge({}, this.shared, results);
      // advance to next panel if this was called by the current panel and it is done - other panels might call this with done
      if (status === 'done' && currentPanel === rasp.currentPanel && rasp.currentPanel < (this.state.typeList.length - 1)) {
        delta.currentPanel = rasp.currentPanel+1;
        this.smoothHeight();  // adjust height
      }
    } else if(action.type==="RESULTS") {
      const {currentPanel, results}=action;
      let newStatus=false;
      if (panelStatus[currentPanel] !== "done") { panelStatus[currentPanel] = "done"; newStatus = true }
      //if (newStatus) this.panelStatus=panelStatus;
      if (results) this.shared = merge({}, this.shared, results);
      if(this.waitingOnResults && this.waitingOnResults.nextFunc) {
        var nextFunc=this.waitingOnResults.nextFunc;
        this.waitingOnResults=null;
        setTimeout(()=>nextFunc(),0);
      } 
    } else if(action.type==="ISSUES") {
      const {currentPanel}=action; 
      if (panelStatus[currentPanel] !== "issues") { panelStatus[currentPanel] = "issues";}
      if (currentPanel < (panelStatus.length - 1)) {  // if the panel is not done, mark all existing forward panels as that
        for (let i = currentPanel + 1; i < panelStatus.length; i++) if (panelStatus[i] !== "issues") { panelStatus[i] = "issues";}
      }
    }else if(action.type==="PANEL_BUTTON"){
      const {nextPanel}=action;
      if( nextPanel===0 || panelStatus[nextPanel]==='done' || panelStatus[nextPanel-1]==='done') {
        delta.currentPanel=nextPanel;
        delta.shape='open';
      }
      this.queueFocus(action);
    } else if(action.type==="RESET_TO_BUTTON"){
      const {nextPanel}=action;
      if( nextPanel===0 || panelStatus[nextPanel]==='done' || panelStatus[nextPanel-1]==='done') {
        delta.currentPanel=nextPanel;
        delta.shape='open';
        let i;
        for(i=nextPanel;i<this.panelList.length;i++){
          this.toChild[i]({type: "RESET"})
          panelStatus[i]="issues";
        }
      }
      this.queueFocus(action);
    }else if(action.type==="PANEL_LIST_CLOSE"){
      delta.shape='truncated';
      Object.keys(this.toChild).forEach(child => { // send the action to every child
        this.toChild[child]({type: "CLEAR_PATH"})
      });
    }else return null;
    Object.assign(nextRASP,rasp,delta);
    var parts=[];
    if(nextRASP.shape==='open') { parts.push('o'); parts.push(nextRASP.currentPanel);}
    nextRASP.pathSegment=parts.join(',');
    return nextRASP;
  }

    segmentToState(action) {
        var parts=action.segment.split(',');
        var shape=parts[0]==='o' ? 'open' : 'truncated';
        var currentPanel = parseInt(parts[1],10) || 0;
        var nextRASP = Object.assign({}, {shape, currentPanel, pathSegment: action.segment}); // note, initialRASP is not being applied. PanelStatus and results are derived
        return { nextRASP, setBeforeWait: true };  //setBeforeWait means set the new state and then wait for the key child to appear, otherwise wait for the key child to appear and then set the new state.
    }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  state = {
    typeList: [],
    containerWidth: 0
  };

  shared = {};

  stepRate = 25; //ms
  inHeight = 'inactive';
  observer = null

  panelList = [];
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount() {
    if (typeof window !== 'undefined' && this.props.panel.type.harmony) {
      window.socket.emit('get listo type', this.props.panel.type.harmony, this.okGetListoType.bind(this))
    }
    this.setState({
      containerWidth: this.refs.panel.clientWidth
    });
    this.observer = new MutationObserver(this.mutations.bind(this));
  }



  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  componentWillUnmount() {
    this.observer.disconnect();
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  mutations(mutations) {
    if (this.inHeight === 'active') return;
    let outer = this.refs.outer;
    if (!this.refs['panel-list-' + this.props.rasp.currentPanel]) return;
    let inner = ReactDOM.findDOMNode(this.refs['panel-list-' + this.props.rasp.currentPanel]);
    if (!(inner)) return;
    let outerHeight = outer.clientHeight;
    let innerHeight = inner.clientHeight;
    let outerMaxHeight = parseInt(outer.style.maxHeight, 10) || 0;
    if (outerHeight != innerHeight || outerMaxHeight != innerHeight) {
      this.smoothHeight();
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidUpdate() {
    let target = this.refs.panel;
    if (this.state.containerWidth != target.clientWidth) {  // could be changed by resizing the window
      this.setState({
        containerWidth: target.clientWidth
      });
    }
    this.observer.observe(target, { attributes: true, childList: true, subtree: true });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  smoothHeight() {
    // set an interval to update scrollTop attribute every 25 ms
    if (this.inHeight == 'active') { return; } //don't stutter the close

    this.inHeight = 'active';

    let outer = this.refs.outer;


    let timerMax = parseInt(2000 / this.stepRate, 10);


    const timer = setInterval(() => {
      if (--timerMax <= 0) { clearInterval(timer); this.inHeight = 'inactive'; return; }
      if (!this.refs['panel-list-' + this.props.rasp.currentPanel]) { // when this happens it's a bug in the parent, but don't let it overload the console with error messages.
        console.error('PanelList.smoothHeight: refs[] does not exist:', 'panel-list-' + this.props.rasp.currentPanel);
        clearInterval(timer); this.inHeight = 'inactive';
        return;
      }
      let inner = ReactDOM.findDOMNode(this.refs['panel-list-' + this.props.rasp.currentPanel]);
      let outerHeight = outer.clientHeight;
      let innerHeight = inner.clientHeight;
      let outerMaxHeight = parseInt(outer.style.maxHeight, 10) || 0;
      if (outerHeight != innerHeight || outerMaxHeight != innerHeight) {
        outer.style.maxHeight = innerHeight + 'px';
      }
    }, this.stepRate);
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  okGetListoType(typeList) {
    for (let i = 0; i < typeList.length; i++) { this.panelList[i] = { content: null }; }
    this.setState({ typeList: typeList });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  nextPanel(currentPanel, status, results) {
    return this.props.rasp.toParent({type: "NEXT_PANEL", currentPanel, status, results});
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    //onsole.info("RASPPanelList.render",this.props);
    let loading;
    let crumbs = [];
    let { typeList } = this.state;
    const { panel, rasp, user } = this.props;

    const currentPanel = rasp.currentPanel;
    const containerWidth = this.state.containerWidth;
    var spaceBetween = containerWidth * 0.25;
    var panelStatus=this.panelStatus; // so this can be accessed by functions

    if (typeof document !== 'undefined') {
      let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      if (containerWidth + spaceBetween < w) {
        spaceBetween = w - containerWidth;
      }
    }


      var renderCrumbs = ()=>{
        return (
          typeList.map((type, i) => {
            if(type.component==="NextStep") return null; // hack for now 11/13/2017, need a more generic way to do this.  Don't show NextStep in crumbs
            let visible = (   (panelStatus[i] === 'done') 
                          || ((i > 0) && panelStatus[i - 1] === 'done'));
            let active = (currentPanel === i );
            let buttonActive = active || visible;
            return(
              <button onClick={buttonActive ? ()=>rasp.toParent({type: "PANEL_BUTTON", nextPanel: i}) : null}
                className={!(active || visible) ? 'inactive' : ''}
                title={type.instruction}
                style={{
                  display: "inline",
                  padding: "0.5em",
                  border: "1px solid #666",
                  boxSizing: "border-box",
                  backgroundColor: active ? "#000" : visible ? "#fff" : "#fff",
                  color: active ? "#fff" : visible ? "#000" : null
                }}
                key={type.name+'-'+i}>
                {type.name}
              </button>
            )
          })
        )
      }

      crumbs = (
        <div style={{
          display: "block",
          marginBottom: "1em",
          marginTop: "1em",
          textAlign: "center"
        }}>
          {renderCrumbs()}
        </div>
      );

      if (rasp.shape==='open' && typeList.length) {
        this.panelList[currentPanel].content = 
          <TypeComponent component={typeList[currentPanel].component}
            parent={panel.parent}
            type={typeList[currentPanel]}
            user={user}
            next={this.nextPanel.bind(this)}
            shared={this.shared}
            panelNum={rasp.currentPanel}
            limit={panel.limit}
            rasp={{ shape: 'truncated', depth: rasp.depth, toParent: this.toMeFromChild.bind(this,currentPanel) }}
          />
      }

      return (
        <section ref="panel">
            {crumbs}
            <div ref='outer'>
              { <div id='panel-list-wide'
                  style={{
                    width: (containerWidth + spaceBetween) * ( this.panelList.length || 1 ) + 'px',
                    left: -currentPanel * (containerWidth + spaceBetween) + 'px',
                    transition: "all 0.5s linear",
                    position: "relative"
                  }}
                >
                  {this.panelList.map((panelListItem, i) => {
                    if (panelListItem.content) {
                      return (
                        <div id={`panel-list-${i}`}
                          ref={`panel-list-${i}`}
                          key={typeList[i]._id+'-'+(panel.parent._id||'none')+'-'+i}
                          style={{
                            display: rasp.shape==='open'?"inline-block":'none',
                            verticalAlign: 'top',
                            marginRight: spaceBetween + 'px',
                            width: containerWidth + 'px'
                          }}
                        >
                          {panelListItem.content}
                        </div>
                      );
                    } else
                      return null;
                  })}
                </div>
              }
            </div>
        </section>
      );
  }

}

export default PanelList;
export { PanelList };

