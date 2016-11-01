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

class Promote extends React.Component {
  state = {expandedL: false,
          expandedR: false};

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
    let node=React.findDOMNode(this.refs.promoteItemLeft);
    if(this.state.expandedL) {
      node.style.marginRight= 0;
      node.style.zIndex=0;
      node.style.width= "48.5%";
      this.state.expandedL=false;
    } else {
      if(this.state.expandedR) { this.toggleRight(); }
      node.style.marginRight= '-41.5%';
      node.style.zIndex=10;
      node.style.width= "90%";
      this.state.expandedL=true;
    }
  }

  toggleRight( itemId, panel) {
    let node=React.findDOMNode(this.refs.promoteItemRight);
    if(this.state.expandedR) {
      node.style.marginLeft= 0;
      node.style.zIndex=0;
      node.style.width= "48.5%";
      this.state.expandedR=false;      
    } else {
      if(this.state.expandedL) { this.toggleLeft(); }
      node.style.marginLeft= '-41.5%';
      node.style.zIndex=10;
      node.style.width= "90%";
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

    if ( show ) {
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

        let promoteMe = (
          <PromoteBigScreenButtons
            key               =   "left-buttons"
            item              =   { left }
            position          =   'left'
            opposite          =   { right }
            evaluated         =   { evaluation.item }
            panel-id          =   { this.props['panel-id'] }
            panel-emitter     =   { panelEmitter }
            emitter           =   { emitter }
            />
        );

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
            <div data-screen="phone-and-up" className="solid">
              <div solid clear>
                <div className="promote-column-left" ref="promoteItemLeft">
                  <Item item={ left } user={ user } toggle={ this.toggleLeft.bind(this) } position='left' key='item-left' />
                  <Feedback className="gutter-top solid" />
                  <Sliders criterias={ evaluation.criterias } className="promote-sliders" />
                  <PromoteBigScreenButtons
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
                <div className="promote-column-right" ref="promoteItemRight">
                  <Item item={ right } user={ user } toggle={ this.toggleRight.bind(this) } position='right' key='item-right' />
                  <Feedback className="gutter-top solid" />
                  <Sliders criterias={ evaluation.criterias } className="promote-sliders" />
                  <div className="promote-column-right">
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
            </div>
            <div className="solid clear" style={{ width : '100%' }}>
              { foo }
            </div>
          ),

          (
            <div data-screen="up-to-phone">
              <Row data-stack="phone-and-down">
                <PromoteSmallScreenColumn
                  { ...this.props }
                  key         =   "left"
                  position    =   "left"
                  item        =   { left }
                  criterias   =   { evaluation.criterias }
                  evaluated   =   { evaluation.item }
                  other       =   { right }
                  descid      =   "left_description"
                  />

                <PromoteSmallScreenColumn
                  { ...this.props }
                  key         =   "right"
                  position    =   "right"
                  item        =   { right }
                  criterias   =   { evaluation.criterias }
                  evaluated   =   { evaluation.item }
                  other       =   { left }
                  descid      =   "right_description"
                  />
              </Row>
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
      <div className="solid">{ content }</div>
    );
  }
}

export default Promote;
