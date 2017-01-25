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
import DoubleWide                   from './util/double-wide';
import { EventEmitter }   from 'events';

class Promote extends React.Component {
  state = {
    expandedL: false,
    expandedR: false,
    activeL: false,
    activeR: false,
    truncateItemsLeft: 0,
    truncateItemsRight: 0,
    closedLeft: false,
    closedRight: false
  };

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  voteEmitter = new EventEmitter();

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount () {
    this.voteEmitter
      .on('next', this.next.bind(this))
      .on('promote', this.promote.bind(this));
  }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

next(){
    this.setState({closedLeft: true, closedRight: true});
    this.buttons={event: 'next', position: null};
}



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
promote(position){
  this.buttons={event: 'promote', position: position};
  if(position==='left'){this.setState({closedRight: true})}
  if(position==='right'){this.setState({closedLeft: true})}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  componentWillUnmount () {
    this.voteEmitter
      .removeListener('next', this.next.bind(this))
      .removeListener('promote', this.promote.bind(this));
  }

buttons={event: null, position: null, wideLeftClosed: false, wideRightClosed: false};

wideLeft(){
  if(this.state.closedLeft){
    if(this.buttons.event==='promote') {
      this.props.emitter.emit('promote',this.buttons.position);
      this.buttons.event='null';
      this.buttons.wideLeftClosed=false;
      this.buttons.wideRightClosed=false;
      this.setState({closedLeft: false})
    }else if(this.buttons.event==='next' && this.buttons.wideRightClosed) {
          this.props.emitter.emit('next');
          this.buttons.event='null';
          this.buttons.wideRightClosed=false;
          this.buttons.wideLeftClosed=false;
          this.setState({closedRight: false, closedLeft: false});
    }else {
      this.buttons.wideLeftClosed=true;
    }
  }
}

wideRight(){
  if(this.state.closedRight){
    if(this.buttons.event==='promote') {
      this.props.emitter.emit('promote',this.buttons.position);
      this.buttons.event='null';
      this.buttons.wideLeftClosed=false;
      this.buttons.wideRightClosed=false;
      this.setState({closedRight: false})
    }else if(this.buttons.event==='next' && this.buttons.wideLeftClosed) {
          this.props.emitter.emit('next');
          this.buttons.event='null';
          this.buttons.wideLeftClosed=false;
          this.buttons.wideRightClosed=false;
          this.setState({closedRight: false, closedLeft: false});
    }else {
      this.buttons.wideRightClosed=true;
    }
  }
}
//**********************************************************
  toggleLeft( itemId, panel) {
    if(this.state.expandedL) {
      this.setState({activeL: false});
      this.state.expandedL=false;
    } else {
      if(this.state.expandedR) { this.toggleRight(); }
      this.setState({activeL: true});
      this.state.expandedL=true;
    }
  }

  toggleRight( itemId, panel) {
    if(this.state.expandedR) {
      this.setState({activeR: false});
      this.state.expandedR=false;      
    } else {
      if(this.state.expandedL) { this.toggleLeft(); }
      this.setState({activeR: true});
      this.state.expandedR=true;
    }
  }

  clearExpanders() {
    if(this.state.expandedL) {
      this.setState({activeL: false} );
      if(this.toChildLeft){this.toChildLeft({state: 'truncated', distance: 0})}
      this.state.expandedL=false;
    }
    if(this.state.expandedR) {
      this.setState({activeR: false, truncateItemsRight: this.state.truncateItemsRight+1});
      if(this.toChildRight){this.toChildRight({state: 'truncated', distance: 0})}
      this.state.expandedR=false;      
    }
  }

  toChildLeft=null;
  toChildRight=null;

  toMeFromChildLeft(vs) {
        if (vs.toChild) { this.toChildLeft = vs.toChild }  // child is passing up her func
  }

  toMeFromChildRight(vs) {
      if (vs.toChild) { this.toChildRight = vs.toChild }  // child is passing up her func
  }

  render () {
    const { panel, show, cursor, limit, evaluation, left, right, emitter, panelEmitter, user, hideFeedback } = this.props;

    const content = [];

    let evaluateQuestion="Which of these is most important for the community to consider?";
    if(panel && panel.type && panel.type.evaluateQuestion) {
      evaluateQuestion = panel.type.evaluateQuestion;
    }

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
        if(left && left.type && left.type.harmony && left.type.harmony.length) {
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
        if(right && right.type && right.type.harmony && right.type.harmony.length) {
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

        let feedbackLeft=[], feedbackRight=[], finishButton=[];
        if(!hideFeedback){
          feedbackLeft=                  
                [<Feedback className="gutter-top solid" />,
                <Sliders criterias={ evaluation.criterias } className="promote-sliders" />];
          feedbackRight=
                  [<Feedback className="gutter-top solid" />,
                  <Sliders criterias={ evaluation.criterias } className="promote-sliders" />];
          finishButton=
            [<div className="gutter-top gutter-bottom solid">
              <FinishButton
                cursor      =   { cursor }
                limit       =   { limit }
                emitter     =   { this.voteEmitter }
                clearExpanders    =   {this.clearExpanders.bind(this)}
                />
            </div>
           ];
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
                <DoubleWide left expanded={this.state.activeL} onComplete={this.wideLeft.bind(this)} closed={this.state.closedLeft}>
                  <Item item={ left } user={ user } toggle={ this.toggleLeft.bind(this) } position='left' key='item-left' 
                    footer =  { leftFooter } className="whole-border" vs= {{state: 'truncated', toParent: this.toMeFromChildLeft.bind(this)}}
                  />
                  {feedbackLeft}
                  <PromoteBigScreenButtons className="promote-big-button"
                    key               =   "left-buttons"
                    item              =   { left }
                    position          =   'left'
                    opposite          =   { right }
                    evaluated         =   { evaluation.item }
                    panel-id          =   { this.props['panel-id'] }
                    panel-emitter     =   { panelEmitter }
                    emitter           =   { this.voteEmitter }
                    clearExpanders    =   {this.clearExpanders.bind(this)}
                  />
                </DoubleWide>
                <DoubleWide right expanded={this.state.activeR} onComplete={this.wideRight.bind(this)} closed={this.state.closedRight} >
                  <Item item={ right } user={ user } toggle={ this.toggleRight.bind(this) } position='right' key='item-right'
                    footer =  { rightFooter } className="whole-border" vs= {{state: 'truncated', toParent: this.toMeFromChildRight.bind(this)}}
                  />
                  {feedbackRight}
                  <PromoteBigScreenButtons
                    key               =   "right-buttons"
                    item              =   { right }
                    position          =   'right'
                    evaluated         =   { evaluation.item }
                    panel-id          =   { this.props['panel-id'] }
                    opposite          =   { left }
                    panel-emitter     =   { panelEmitter }
                    emitter           =   { this.voteEmitter }
                    clearExpanders    =   {this.clearExpanders.bind(this)}
                    />
                </DoubleWide>
              </div>
              <div className="solid clear" style={{ width : '100%' }}>
                { foo }
              </div>
            </div>
          ),
          finishButton
        );
      }
    }

    return (
      <div>{ content }</div>
    );
  }
}

export default Promote;
