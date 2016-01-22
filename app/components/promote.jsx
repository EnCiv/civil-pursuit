'use strict';

import React from 'react';
import Row from './util/row';
import itemType                       from '../lib/proptypes/item';
import criteriaType        from '../lib/proptypes/criteria';
import Column from './util/column';
import ItemMedia                      from './item-media';
import TextArea                       from './util/text-area';
import Sliders                        from './sliders';
import Button                         from './util/button';
import Loading                        from './util/loading';
import Subject            from './promote-item-subject';
import Description        from './promote-item-description';

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Reference extends React.Component {
  static propTypes = {
    title : React.PropTypes.string,
    url : React.PropTypes.string.isRequired
  }

  render () {
    return (
      <h5>
        <a href={ this.props.url } rel="nofollow" target="_blank">{ this.props.title || this.props.url }</a>
      </h5>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Feedback extends React.Component {
  render () {
    return (
      <div { ...this.props }>
        <TextArea block placeholder="Can you provide feedback that would encourage the author to create a statement that more people would unite around?" className="user-feedback block"></TextArea>
      </div>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class PromoteButton extends React.Component {
  static propTypes = {
    subject : React.PropTypes.string
  }

  render () {
    return (
      <Button block { ...this.props }>{ this.props.subject }</Button>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class EditAndGoAgain extends React.Component {
  static propTypes = {
    items : React.PropTypes.arrayOf(itemType),
    'panel-id' : React.PropTypes.string,
    item : itemType
  }

  editAndGoAgain (e) {
    if ( this.props.items[this.props.item._id] ) {
      window.Dispatcher.emit('set active', this.props['panel-id'], `${this.props.item._id}-edit-and-go-again`);
    }
    else {
      window.Dispatcher.emit('get item', this.props.item._id);
    }
  }

  render () {
    return (
      <Button block { ...this.props } onClick={ this.editAndGoAgain.bind(this) }><i>Edit and go again</i></Button>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Finish extends React.Component {
  static propTypes = {
    evaluated : React.PropTypes.bool
  }

  next () {
    let { emitter } = this.props;

    let view = React.findDOMNode(this.refs.view);

    let parent = view.closest('.item-promote');

    emitter.emit('next');
  }

  render () {
    let text = 'Neither';

    let { cursor, limit } = this.props;

    if ( cursor === limit ) {
      text = 'Finish';
    }

    return (
      <Button block { ...this.props } onClick={ this.next.bind(this) } ref="view" className="finish-evaluate">
        <b>{ text }</b>
      </Button>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class ColumnItem extends React.Component {
  static propTypes = {
    item : itemType,
    position : React.PropTypes.string
  }

  render () {
    let { item, position } = this.props;

    if ( ! item ) {
      return ( <div></div> );
    }

    return (
      <Column span="50" className={ `promote-${position}` }>
        <ItemMedia item={ item } />
        <Subject subject={ item.subject } />
        <Reference { ...item.references[0] } />
        <Description description={ item.description } />
      </Column>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class ColumnFeedback extends React.Component {
  static propTypes = {
    item : itemType,
    position : React.PropTypes.string
  }

  render () {
    let { item, position } = this.props;

    if ( ! item ) {
      return ( <div></div> );
    }

    return (
      <Column span="50" className={ `promote-${position}` }>
        <Feedback className="gutter-top" />
      </Column>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class ColumnSliders extends React.Component {
  static propTypes = {
    item : itemType,
    position : React.PropTypes.string,
    criterias : React.PropTypes.arrayOf(criteriaType)
  }

  render () {
    let { item, position, criterias } = this.props;

    if ( ! item ) {
      return ( <div></div> );
    }

    return (
      <Column span="50" className={ `promote-${position}` }>
        <Sliders criterias={ criterias } className="promote-sliders" />
      </Column>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class ColumnButtons extends React.Component {
  static propTypes = {
    item : itemType,
    position : React.PropTypes.string
  }

  next () {
    let { item, position, evaluated } = this.props;

    let view = React.findDOMNode(this.refs.view);

    let parent = view.closest('.item-promote');

    window.Dispatcher.emit('promote item', item, position, evaluated, parent);
  }

  render () {

    let { item, position } = this.props;

    if ( ! item ) {
      return ( <div></div> );
    }

    return (
      <Column span="50" className={ `promote-item-button promote-${position} promote-item-${position}` } ref="view">
        <PromoteButton { ...item } onClick={ this.next.bind(this) } className="gutter-bottom" />
        <EditAndGoAgain { ...this.props } panel-id={ this.props['panel-id'] } item={ item } />
      </Column>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class SideColumn extends React.Component {
  static propTypes = {
    item : itemType,
    position : React.PropTypes.string,
    evaluated : React.PropTypes.bool,
    criterias : React.PropTypes.arrayOf(criteriaType),
    other : itemType
  }

  next () {
    let { item, position, evaluated } = this.props;

    let view = React.findDOMNode(this.refs.view);

    let parent = view.closest('.item-promote');

    window.Dispatcher.emit('promote item', item, position, evaluated, parent);
  }

  render () {
    let { item, criterias, position, other } = this.props;

    if ( ! item ) {
      return ( <div></div> );
    }

    let promoteMe = (
      <PromoteButton { ...item } onClick={ this.next.bind(this) } className="gutter-bottom" />
    );

    if ( ! other ) {
      promoteMe = ( <div></div> );
    }

    return (
      <Column span="50" className={ `promote-${position}` } ref="view">
        <ItemMedia item={ item } />
        <Subject subject={ item.subject } />
        <Reference { ...item.references[0] } />
        <Description description={ item.description } />
        <div style={{ clear: 'both' }} />
        <Sliders criterias={ criterias } className="promote-sliders" />
        <Feedback className="gutter-top" />
        <div className="gutter-top">
          <div className={`promote-item-${position}`}>
            { promoteMe }
          </div>
          <EditAndGoAgain { ...this.props } panel-id={ this.props['panel-id'] } item={ item } />
        </div>
      </Column>
    );
  }
}

class Promote extends React.Component {

  render () {
    const { show, cursor, limit, evaluation, left, right, emitter } = this.props;

    const content = [];

    if ( show ) {
      if ( ! evaluation ) {
        content.push( <Loading message="Loading evaluation" /> );
      }
      else {
        let foo = <h5 className="text-center gutter">Which of these is most important for the community to consider?</h5>;

        if ( ! left || ! right ) {
          foo = ( <div></div> );
        }

        let promoteMe = (
          <ColumnButtons
            key         =   "left-buttons"
            item        =   { left }
            position    =   'left'
            evaluated   =   { evaluation.item }
            panel-id    =   { this.props['panel-id'] }
            />
        );

        if ( ! left || ! right ) {
          promoteMe = ( <div></div> );
        }

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

                <ColumnButtons
                  key         =   "right-buttons"
                  item        =   { right }
                  position    =   'right'
                  evaluated   =   { evaluation.item }
                  panel-id    =   { this.props['panel-id'] }
                  />

              </Row>
            </div>
          ),

          (
            <div data-screen="up-to-phone">
              <Row data-stack="phone-and-down">
                <SideColumn
                  { ...this.props }
                  key         =   "left"
                  position    =   "left"
                  item        =   { left }
                  criterias   =   { evaluation.criterias }
                  evaluated   =   { evaluation.item }
                  other       =   { right }
                  />

                  <SideColumn
                    { ...this.props }
                    key         =   "right"
                    position    =   "right"
                    item        =   { right }
                    criterias   =   { evaluation.criterias }
                    evaluated   =   { evaluation.item }
                    other       =   { left }
                    />
              </Row>
            </div>
          ),

          (
            <div className="gutter">
              <Finish
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
