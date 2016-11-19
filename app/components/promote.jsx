'use strict';

import React                    from 'react';
import Row                      from './util/row';
import Loading                  from './util/loading';
import PromoteBigScreenButtons  from './promote-big-screen-buttons';
import ColumnItem               from './promote-column-item';
import ColumnSliders            from './promote-column-sliders';
import PromoteSmallScreenColumn from './promote-small-screen-column';
import FinishButton             from './promote-finish-button';
import ColumnFeedback           from './promote-feedback-column';
import Item                     from './item';
import Feedback from './promote-feedback';
import Sliders from './sliders';
import Harmony            from './harmony';
import Accordion          from './util/accordion';

class Promote extends React.Component {
  state = {
    expandedL: false,
    expandedR: false,
    activeL: false,
    activeR: false
  };

componentDidUpdate () {
    
/////////////--------------------HANS
//    if (document.getElementById('left_description') != null && document.getElementById('right_description') != null) {
//        var ly = document.getElementById('left_description').offsetHeight;
//        var ry = document.getElementById('right_description').offsetHeight;
//        if (ly < ry) {
//          document.getElementById('left_description').style.height = ry + "px";
//        }
//        else {
//          document.getElementById('right_description').style.height = ly + "px";
//        }
//    }  
//    if (document.getElementById('h5_left') != null && document.getElementById('h5_right') != null) {
//        var ly = document.getElementById('h5_left').offsetHeight;
//        var ry = document.getElementById('h5_right').offsetHeight;
//        if (ly < ry) {
//          document.getElementById('h5_left').style.height = ry + "px";
//        }
//        else {
//          document.getElementById('h5_right').style.height = ly + "px";
//        }  
//   } 
    }
//**********************************************************
  toggleLeft( itemId, panel) {
    console.info("promote.promoteMore", itemId, panel, this);
    let node=this.refs.promoteItemLeft;
    if(this.state.expandedL) {
      this.setState({activeL: false});
      //node.style.marginRight= 0;
      //node.style.zIndex=1;
      //node.style.width= "48.5%";
      //node.style.boxShadow=  'none';
      this.state.expandedL=false;
    } else {
      if(this.state.expandedR) { this.toggleRight(); }
      this.setState({activeL: true});
      //node.style.boxShadow=  "0 0 10px 10px rgba(0, 0, 0, 0.3)";
      //node.style.marginRight= '-41.5%';
      //node.style.zIndex=10;
      //node.style.width= "90%";
      this.state.expandedL=true;
    }
  }

  toggleRight( itemId, panel) {
    let node=this.refs.promoteItemRight;
    if(this.state.expandedR) {
      this.setState({activeR: false});
      //node.style.marginLeft= 0;
      //node.style.zIndex=1;
      //node.style.width= "48.5%";
      //node.style.boxShadow=  'none';
      this.state.expandedR=false;      
    } else {
      if(this.state.expandedL) { this.toggleLeft(); }
      this.setState({activeR: true});
      //node.style.boxShadow=  "0 0 10px 10px rgba(0, 0, 0, 0.3)";
      //node.style.marginLeft= '-41.5%';
      //node.style.zIndex=10;
      //node.style.width= "90%";
      this.state.expandedR=true;
    }
  }




  render () {
    const { panel, show, cursor, limit, evaluation, left, right, emitter, panelEmitter, user } = this.props;

    const content = [];

    let evaluateQuestion="Which of these is most important for the community to consider?";
    if(panel && panel.type && panel.type.evaluateQuestion) {
      evaluateQuestion = panel.type.evaluateQuestion;
    }

    console.info("promote.render", panel);

    if ( true ) {
      if ( ! evaluation ) {
        content.push( <Loading message="Loading evaluation" /> );
      }
      else {
        let foo = (
          <h5 className="text-center gutter solid">
            { evaluateQuestion }
          </h5>
        );

        if ( ! left || ! right ) {
          foo = ( <div></div> );
        }

        let leftFooter;
        if(left.type.harmony) {
          leftFooter=(
                      <div className="toggler harmony">
                        <Accordion
                          name    =   "harmony"
                          active  =   { this.state.activeL }
                          >
                          <Harmony
                            item    =   { left }
                            ref     =   "harmony"
                            user    =   { user }
                            active  =   { this.state.activeL }
                            />
                        </Accordion>
                      </div>
                    );
        }

        let rightFooter;
        if(right.type.harmony) {
          rightFooter=(
                      <div className="toggler harmony">
                        <Accordion
                          name    =   "harmony"
                          active  =   { this.state.activeR }
                          >
                          <Harmony
                            item    =   { right }
                            ref     =   "harmony"
                            user    =   { user }
                            active  =   { this.state.activeR }
                            />
                        </Accordion>
                      </div>
                    );
        }

        content.push(
          (
            <header className="text-center gutter-bottom solid">
              <h2>
                <span className="cursor">{ cursor }</span>
                <span> of </span>
                <span className="limit">{ limit }</span>
              </h2>
              <h4>{ evaluateQuestion }</h4>
            </header>
          ),

          (
            <div className="solid">
              <div className="solid clear">
                <div className={`promote-column-left ${this.state.activeL ? 'expanded' : ''}`} ref="promoteItemLeft">
                  <Item item={ left } user={ user } toggle={ this.toggleLeft.bind(this) } position='left' key='item-left' 
                    footer =  { leftFooter } className="whole-border"
                  />
                  <Feedback className="gutter-top solid" />
                  <Sliders criterias={ evaluation.criterias } className="promote-sliders" />
                  <PromoteBigScreenButtons className="promote-big-button"
                    key               =   "left-buttons"
                    item              =   { left }
                    position          =   'left'
                    opposite          =   { right }
                    evaluated         =   { evaluation.item }
                    panel-id          =   { this.props['panel-id'] }
                    panel-emitter     =   { panelEmitter }
                    emitter           =   { emitter }
                  />
                </div>
                <div className={`promote-column-right ${this.state.activeR ? 'expanded' : '' }`} ref="promoteItemRight">
                  <Item item={ right } user={ user } toggle={ this.toggleRight.bind(this) } position='right' key='item-right'
                    footer =  { rightFooter }
                  />
                  <Feedback className="gutter-top solid" />
                  <Sliders criterias={ evaluation.criterias } className="promote-sliders" />
                  <PromoteBigScreenButtons
                    key               =   "right-buttons"
                    item              =   { right }
                    position          =   'right'
                    evaluated         =   { evaluation.item }
                    panel-id          =   { this.props['panel-id'] }
                    opposite          =   { left }
                    panel-emitter     =   { panelEmitter }
                    emitter           =   { emitter }
                    />
                </div>
              </div>
              <div className="solid clear" style={{ width : '100%' }}>
                { foo }
              </div>
            </div>

          ),

          (
            <div className="gutter solid">
              <FinishButton
                cursor      =   { cursor }
                limit       =   { limit }
                emitter     =   { emitter }
                />
            </div>
          )
        );
      }
    }

    return (
      <div>{ content }</div>
    );
  }
}

export default Promote;
