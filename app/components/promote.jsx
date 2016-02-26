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

class Promote extends React.Component {

componentDidUpdate () {
    
/////////////--------------------HANS
    if (document.getElementById('left_description') != null && document.getElementById('right_description') != null) {
        alert('offsetX');
        var ly = document.getElementById('left_description').offsetHeight;
        var ry = document.getElementById('right_description').offsetHeight;
        if (ly < ry) {
          document.getElementById('left_description').style.height = ry + "px";
        }
        else {
          document.getElementById('right_description').style.height = ly + "px'";
        }
    }  
  }

  render () {
    const { show, cursor, limit, evaluation, left, right, emitter, panelEmitter } = this.props;

    const content = [];

    if ( show ) {
      if ( ! evaluation ) {
        content.push( <Loading message="Loading evaluation" /> );
      }
      else {
        let foo = (
          <h5 className="text-center gutter">
            Which of these is most important for the community to consider?
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
            <header className="text-center gutter-bottom">
              <h2>
                <span className="cursor">{ cursor }</span>
                <span> of </span>
                <span className="limit">{ limit }</span>
              </h2>
              <h4>Evaluate each item below</h4>
            </header>
          ),

          (
            <div data-screen="phone-and-up">
              <Row>
                <ColumnItem item={ left } position='left' key='item-left' />

                <ColumnItem item={ right } position='right' key='item-right' />
              </Row>

              <Row>
                <ColumnFeedback key="left-feedback" item={ left } position='left' />

                <ColumnFeedback key="right-feedback" item={ right } position='right' />
              </Row>

              <Row>
                <ColumnSliders key="left-sliders"  item={ left } position='left' criterias={ evaluation.criterias } />

                <ColumnSliders key="right-sliders" item={ right } position='right' criterias={ evaluation.criterias } />

              </Row>

              { foo }

              <Row>
                { promoteMe }

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

              </Row>
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
            <div className="gutter">
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
