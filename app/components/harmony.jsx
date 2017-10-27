'use strict';

import React                        from 'react';
import Loading                      from './util/loading';
import Row                          from './util/row';
import Column                       from './util/column';
import PanelItems                   from './panel-items';
import makePanelId                  from '../lib/app/make-panel-id';
import itemType                     from '../lib/proptypes/item';
import panelType                    from '../lib/proptypes/panel';
import PanelStore                   from './store/panel';
import DoubleWide                   from './util/double-wide';
import {ReactActionStatePath, ReactActionStatePathClient}  from 'react-action-state-path';

export default class Harmony extends React.Component {
  render(){
    console.info("Harmony above.render");
    return(
    <ReactActionStatePath {...this.props}>
      <RASPHarmony />
     </ReactActionStatePath>
    )
  }
}

class RASPHarmony extends ReactActionStatePathClient {

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props, 'side', 1);
    console.info("RASPHarmony.constructor", this.props)
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // this is where component specific actions are converted to component specific states
  //

  segmentToState(action) {
    var side = action.segment;
    var nextRASP = { shape: 'open', side: side, pathSegment: side };
    return { nextRASP, setBeforeWait: false };  //setBeforeWait means set the new state and then wait for the key child to appear, otherwise wait for the key child to appear and then set the new state.
  }

  actionToState(action,rasp, source, defaultRASP) {
    if(this.debug) console.info("RASPHarmony.actionToState", ...arguments);
    var nextRASP={};
    let delta={};
    if(action.type==="CHILD_SHAPE_CHANGED"){
      if(action.shape==='open'){
        delta.side=action.side; // action is to open, this side is going to be the open side
      } else if(action.side === rasp.side) { 
        delta.side=null; // if action is to truncate (not open), and it's from the side that's open then truncate this
        this.toChild[rasp.side]({type: "CHANGE_SHAPE", shape: defaultRASP.shape});
      }
      if(delta.side && rasp.side && rasp.side!== delta.side) this.toChild[rasp.side]({type: "RESET_STATE"}); // if a side is going to be open, and it's not the side that is open, close the other side
    } else if(action.type==="DECENDANT_FOCUS") {
        this.toChild[(action.side === 'L') ? 'R' : 'L']({type: "CHANGE_SHAPE", shape: "open"}) 
    } else if(action.type==="DECENDANT_UNFOCUS") {
      this.toChild[(action.side === 'L') ? 'R' : 'L']({type: "RESET_SHAPE"}) 
    } else 
      return null; // don't know the action type so let the default handler have it
    Object.assign(nextRASP,rasp,delta);
    nextRASP.shape = nextRASP.side ? 'open' : defaultRASP.shape;
    nextRASP.pathSegment= nextRASP.side ? nextRASP.side : null;
    return nextRASP;
  }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const { active, item, rasp, ...otherProps } = this.props;
    console.info("Harmony.render",this.props);
    var shape=rasp.shape === 'open' ? 'truncated' : rasp.shape;

    let  contentLeft = (
        <DoubleWide className="harmony-pro" left expanded={rasp.side==='L'} key={item._id+'-left'}>
          <PanelStore type={ item.harmony.types[0] } parent={ item } >
              <PanelItems {...otherProps} rasp={this.childRASP(shape, 'L')} />
          </PanelStore>
        </DoubleWide>
      );

    let contentRight = (
        <DoubleWide className="harmony-con" right expanded={rasp.side==='R'}  key={item._id+'-right'} >
          <PanelStore type={ item.harmony.types[1] } parent={ item } >
              <PanelItems {...otherProps} rasp={this.childRASP(shape,'R')} />
          </PanelStore>
        </DoubleWide>
      );

    return (
      <section className={`item-harmony ${this.props.className}`}>
        { contentLeft }
        { contentRight }
      </section>
    );
  }
}
