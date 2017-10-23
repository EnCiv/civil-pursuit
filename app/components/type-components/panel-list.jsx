'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Loading from '../util/loading';
import TypeComponent from '../type-component';
import Panel from '../panel';
import Instruction from '../instruction';
import merge from 'lodash/merge';
import { ReactActionStatePath, ReactActionStatePathClient } from 'react-action-state-path';
import PanelHead from '../panel-head';

class PanelList extends React.Component {
  initialRASP={currentPanel: 0};
  render() {
    console.info("PanelList.render", this.props);
    return (
      <PanelHead {...this.props} cssName={'syn-panel-list'} >
        <ReactActionStatePath initialRASP={this.initialRASP}>
          <RASPPanelList />
        </ReactActionStatePath>
      </PanelHead>
    );
  }
}

class RASPPanelList extends React.Component {

  constructor(props) {
    console.log("RASPPanelList.constructor", props);
    super(props);
    this.toChild = [];
    this.keyField = 'currentPanel';
    this.waitingOn = null;
    this.panelStatus=[];
    if (!this.props.rasp) logger.error("ReactActionStatePathClient no rasp", this.constructor.name, this.props);
    if (this.props.rasp.toParent) {
      this.props.rasp.toParent({ type: "SET_TO_CHILD", function: this.toMeFromParent.bind(this), name: this.constructor.name, actionToState: this.actionToState.bind(this), clientThis: this })
    } else logger.error("ReactActionStatePathClient no rasp.toParent", this.props);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // this is a one to many pattern for the RASP, insert yourself between the RASP and each child
  // send all unhandled actions to the parent RASP
  //
  toMeFromChild(key, action) {
    logger.trace(" ReactActionStatePathClient.toMeFromChild", this.props.rasp.depth, key, action);
    if (action.type === "SET_TO_CHILD") { // child is passing up her func
      this.toChild[key] = action.function; // don't pass this to parent
      if (this.waitingOn) {
        if (this.waitingOn.nextRASP) {
          let nextRASP = this.waitingOn.nextRASP;
          if (key === nextRASP[this.keyField] && this.toChild[key]) {
            logger.trace("ReactActionStatePathClient.toMeFromParent got waitingOn nextRASP", nextRASP);
            var nextFunc = this.waitingOn.nextFunc;
            this.waitingOn = null;
            if (nextFunc) setTimeout(nextFunc, 0);
            else setTimeout(() => this.props.rasp.toParent({ type: "SET_STATE_AND_CONTINUE", nextRASP: nextRASP, function: this.toChild[key] }), 0);
          }
        }
      }
    } else {
      action[this.keyField] = key; // actionToState may need to know the child's id
      var result = this.props.rasp.toParent(action);
      // logger.trace(this.constructor.name, this.title, action,'->', this.props.rasp);
      return result;
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // this can handle a one to many pattern for the RASP, handle each action  appropriatly
  //
  toMeFromParent(action) {
    logger.trace("ReactActionStatePathClient.toMeFromParent", this.props.rasp.depth, action);
    if (action.type === "ONPOPSTATE") {
      console.log("RASPPanelList.toMeFromParent ONPOPSTATE", this.props.rasp.depth, action);
      let { stackDepth, stateStack } = action;

      let keepChild = [];
      Object.keys(this.toChild).forEach(child => keepChild[child] = false);

      stateStack[stackDepth+1].raspChildren.forEach(child => {
        if (this.toChild[child.key]) {
          this.toChild[child.key]({ type: "ONPOPSTATE", stateStack: child.stateStack, stackDepth: 0 });
          keepChild[child.key] = true;
        } else console.error("RASPPanelList.toMeFromParent ONPOPSTATE no child:", child.key);
      })

      keepChild.forEach((keep, child) => { // child id is the index
        if (!keep) {
          console.error("RASPPanelList.toMeFromParent ONPOPSTATE child not kept", child);
          this.toChild[child]({ type: "CLEAR_PATH" }); // only one button panel is open, any others are truncated (but inactive)
        }
      })
      return;// this was the end of the line
    } else if (action.type === "GET_STATE") {
      // get the state info from all the children and combind them into one Object
      console.log("RASPPanelList.toMeFromParent GET_STATE", this.props.rasp.depth, action);
      var raspChildren = Object.keys(this.toChild).map(child => {
        return {
          stateStack: this.toChild[child]({ type: "GET_STATE" }),
          key: child
        }
      });
      if(raspChildren.length===1 && !raspChildren[0].stateStack) return null; // if the only child doesn't really exist yet (because it returns null) just return null
      var curPath = raspChildren.reduce((acc, cur, i) => { // parse the state to build the curreent path
        if (cur.stateStack && cur.stateStack[i] && cur.stateStack[i].pathSegment) acc.push(cur.stateStack[i].pathSegment);
        return acc;
      }, []);
      if (raspChildren.length) {
        var result = { raspChildren: raspChildren, depth: this.props.rasp.depth + 1, shape: 'multichild' };
        if (curPath.length) result.pathSegment = curPath.join(':');
        console.log("RASPPanelList.toMeFromParent GET_STATE returns", result);
        return [result];
      } else
        return null;
    } else if (action.type === "CLEAR_PATH") {  // clear the path and reset the RASP state back to what the const
      Object.keys(this.toChild).forEach(child => { // send the action to every child
        this.toChild[child](action)
      });
    } else if (action.type === "SET_PATH") {
      const { nextRASP, setBeforeWait } = this.segmentToState(action);
      console.info("RASPPanelList.toMeFromParent SET_PATH", action)
      if (nextRASP[this.keyField]) {
        let key = nextRASP[this.keyField];
        /*if (this.toChild[key]) this.props.rasp.toParent({ type: 'SET_STATE_AND_CONTINUE', nextRASP: nextRASP, function: this.toChild[key] }); // note: toChild of button might be undefined becasue ItemStore hasn't loaded it yet
        else */ if (setBeforeWait) {
          var that=this;
          var setPredicessors=()=>{
            let predicessors=that.toChild.length;
            console.info("RASPPanelList.toMeFromParent.setPredicessors", key, predicessors);
            if(predicessors < key) {
              var predicessorRASP=Object.assign({},nextRASP,{[that.keyField]: predicessors});
              that.waitingOnResults={ nextFunc: setPredicessors.bind(this)};
              that.props.rasp.toParent({ type: "SET_STATE", nextRASP: predicessorRASP });
            }else {
              that.waitingOn={ nextRASP, nextFunc: () => that.props.rasp.toParent({ type: "CONTINUE_SET_PATH", function: that.toChild[key] }) };
              that.props.rasp.toParent({ type: "SET_STATE", nextRASP });
            }
          }
          setPredicessors();
        } else {
          logger.trace("ReactActionStatePathClient.toMeFromParent SET_PATH waitingOn", nextRASP);
          this.waitingOn = { nextRASP };
        }
      } else {
        this.props.rasp.toParent({ type: 'SET_STATE_AND_CONTINUE', nextRASP: nextRASP, function: null });
      }
    } else logger.error("ReactActionStatePathClient.toMeFromParent action type unknown not handled", action)
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
      var panelStatus = this.panelStatus;
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
      const {currentPanel}=action;
      if( currentPanel===0 || panelStatus[currentPanel]==='done' || panelStatus[currentPanel-1]==='done') {
        delta.currentPanel=currentPanel;
        if(rasp.shape==='truncated') delta.shape='open';
        setTimeout(()=>this.props.rasp.toParent({type: "DECENDANT_FOCUS"}),0); // user focus is here
      }
    }else if(action.type==="DECENDANT_FOCUS"){
      if(action.distance > 1) delta.shape='title';
      if(action.distance ==1) delta.shape='open';
      //latch onto the titlize stata unless changed from above - else if(rasp.shape==='title' && action.shape==='open') delta.shape='open';
      // else no change
    } else return null;
    Object.assign(nextRASP,rasp,delta);
    var parts=[];
    if(nextRASP.shape==='open' || nextRASP.shape==='title') { parts.push('o'); parts.push(nextRASP.currentPanel);}
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
    for (let i = 0; i < typeList.length; i++) { this.panelList[i] = { content: [] }; }
    this.setState({ typeList: typeList });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  nextPanel(currentPanel, status, results) {
    return this.props.rasp.toParent({type: "NEXT_PANEL", currentPanel, status, results});
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    console.info("RASPPanelList.render",this.props);
    const content = [];
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
            let visible = (   (panelStatus[i] === 'done') 
                          || ((i > 0) && panelStatus[i - 1] === 'done'));
            let active = (currentPanel === i );
            let buttonActive = active || visible;
            return(
              <button onClick={buttonActive ? ()=>rasp.toParent({type: "PANEL_BUTTON", currentPanel: i}) : null}
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
                key={type._id+'-panel-'+i}
              >
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

      if ((rasp.shape==='open' || rasp.shape==='title') && typeList.length) {
        this.panelList[currentPanel].content = [(
          <TypeComponent component={typeList[currentPanel].component}
            parent={panel.parent}
            type={typeList[currentPanel]}
            user={user}
            next={this.nextPanel.bind(this)}
            shared={this.shared}
            panelNum={rasp.currentPanel}
            limit={panel.limit}
            rasp={{ shape: 'truncated', depth: rasp.depth, toParent: this.toMeFromChild.bind(this,currentPanel) }}
            key={typeList[currentPanel]._id+'-panel-'+currentPanel}
          />
        )];
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
                    if (panelListItem.content.length) {
                      return (
                        <div id={`panel-list-${i}`}
                          ref={`panel-list-${i}`}
                          style={{
                            display: (rasp.shape==='open' || rasp.shape==='title') ? "inline-block":'none',
                            verticalAlign: 'top',
                            marginRight: spaceBetween + 'px',
                            width: containerWidth + 'px'
                          }}
                          key={typeList[i]._id+'-panel-'+i}
                        >
                          {panelListItem.content}
                        </div>
                      );
                    } else
                      return [];
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

