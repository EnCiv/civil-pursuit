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
import {UserInterfaceManager, UserInterfaceManagerClient}  from './user-interface-manager';

export default class Harmony extends React.Component {
  render(){
    console.info("Harmony above.render");
    return(
    <UserInterfaceManager {...this.props}>
      <UIMHarmony />
     </UserInterfaceManager>
    )
  }
}

class UIMHarmony extends UserInterfaceManagerClient {

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    console.info("UIMHarmony.constructor", props)
    var uimProps={uim: props.uim};
    super(uimProps, 'side');
    console.info("UIMHarmony.constructor", this.props)
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // this is where component specific actions are converted to component specific states
  //

  setPath(action) {
    var side = action.part;
    var nextUIM = { shape: 'open', side: side, pathPart: [side] };
    return { nextUIM, setBeforeWait: false };  //setBeforeWait means set the new state and then wait for the key child to appear, otherwise wait for the key child to appear and then set the new state.
  }

  actionToState(action,uim) {
    logger.info("UIMHarmony.actionToState", {action}, {uim});
    var nextUIM={};
    if(action.type==="CHILD_SHAPE_CHANGED"){
      let delta={};
      if(action.shape==='open') delta.side=action.side; // action is to open, this side is going to be the open side
      else if(action.side === uim.side) delta.side=null; // if action is to truncate (not open), and it's from the side that's open then truncate this
      if(delta.side && uim.side && uim.side!== delta.side) this.toChild[uim.side]({type: "CHANGE_STATE", shape: 'truncated'}); // if a side is going to be open, and it's not the side that is open, close the other side
      if(delta.side) delta.pathPart=[delta.side]; // if a side is open, include it in the partPath
      else delta.pathPart=[]; //otherwise no path part
      Object.assign(nextUIM, uim, delta);
      return nextUIM; // return the new state
    } else return null; // don't know the action type so let the default handler have it
  }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const { active, item, user, uim } = this.props;
    console.info("Harmony.render",this.props);

    const leftUIM={shape: 'truncated', depth: uim.depth, toParent: this.toMeFromChild.bind(this, 'L')};  // inserting me between my parent and my child
    const rightUIM={shape: 'truncated', depth: uim.depth, toParent: this.toMeFromChild.bind(this, 'R')};  // inserting me between my parent and my child

    let  contentLeft = (
        <DoubleWide className="harmony-pro" left expanded={uim.side==='L'} key={item._id+'-left'}>
          <PanelStore type={ item.harmony.types[0] } parent={ item } limit={this.props.limit}>
            <UserInterfaceManager user={ user } uim={leftUIM} hideFeedback = {this.props.hideFeedback}>
              <PanelItems />
            </UserInterfaceManager>
          </PanelStore>
        </DoubleWide>
      );

    let contentRight = (
        <DoubleWide className="harmony-con" right expanded={uim.side==='R'}  key={item._id+'-right'} >
          <PanelStore type={ item.harmony.types[1] } parent={ item } limit={this.props.limit}>
            <UserInterfaceManager user={ user } uim={rightUIM} hideFeedback = {this.props.hideFeedback}>
              <PanelItems />
            </UserInterfaceManager>
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
