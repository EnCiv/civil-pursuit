'use strict';

import React            from 'react';
import Row              from './util/row';
import Column           from './util/column';
import ItemMedia        from './item-media';
import Loading          from './util/loading';
import Sliders          from './sliders';
import TextArea         from './util/text-area';
import Button           from './util/button';
import Component        from '../lib/app/component';

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Header extends React.Component {
  render () {
    let { evaluation } = this.props;

    return (
      <header className="text-center gutter-bottom">
        <h2>{ evaluation.cursor } of { evaluation.limit }</h2>
        <h4>Evaluate each item below</h4>
      </header>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Subject extends React.Component {
  render () {
    return (
      <h4>{ this.props.subject }</h4>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Description extends React.Component {
  render () {
    return (
      <section className="promote-description">{ this.props.description }</section>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Reference extends React.Component {
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
  render () {
    return (
      <Button block { ...this.props }>{ this.props.subject }</Button>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class EditAndGoAgain extends React.Component {
  render () {
    return (
      <Button block { ...this.props }><i>Edit and go again</i></Button>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Finish extends React.Component {
  next () {
    let { position, evaluated } = this.props;

    let view = React.findDOMNode(this.refs.view);

    let parent = view.closest('.item-promote');

    window.Dispatcher.emit('promote item', null, null, evaluated, parent);
  }

  render () {
    let text = 'Neither';

    let { cursor, limit } = this.props;

    if ( cursor === limit ) {
      text = 'Finish';
    }

    return (
      <Button block { ...this.props } onClick={ this.next.bind(this) } ref="view">
        <b>{ text }</b>
      </Button>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class ColumnItem extends React.Component {
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
      <Column span="50" className={ `promote-${position}` } ref="view">
        <PromoteButton { ...item } onClick={ this.next.bind(this) } className="gutter-bottom" />
        <EditAndGoAgain />
      </Column>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class SideColumn extends React.Component {
  render () {
    let { item, position, criterias, other } = this.props;

    if ( ! item ) {
      return ( <div></div> );
    }

    let promoteMe = (
      <PromoteButton { ...item } className="gutter-bottom" />
    );

    if ( ! other ) {
      promoteMe = ( <div></div> );
    }

    return (
      <Column span="50" className={ `promote-${position}` }>
        <ItemMedia item={ item } />
        <Subject subject={ item.subject } />
        <Reference { ...item.references[0] } />
        <Description description={ item.description } />
        <div style={{ clear: 'both' }} />
        <Sliders criterias={ criterias } className="promote-sliders" />
        <Feedback className="gutter-top" />
        <div data-screen="phone-and-down" className="gutter-top">
          { promoteMe }
          <EditAndGoAgain />
        </div>
      </Column>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Promote extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);

    this.status = 'iddle';
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentWillReceiveProps (props) {
    if ( this.status === 'iddle' && props.active ) {
      this.status = 'ready';
      window.Dispatcher.emit('get evaluation', this.props.item);
    }
    else if ( this.props.items[this.props.item._id] && ! this.props.items[this.props.item._id].evaluation && this.status === 'ready' ) {
      this.status = 'iddle';
      window.Dispatcher.emit('set active', props['panel-id'], `${this.props.item._id}-details`);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {

    let content = ( <Loading message="Loading evaluation" /> );

    if ( this.props.items[this.props.item._id] && this.props.items[this.props.item._id].evaluation ) {

      let { evaluation } = this.props.items[this.props.item._id];

      let { left, right, criterias, item } = evaluation;

      content = [];

      let foo = <h5 className="text-center gutter">Which of these is most important for the community to consider?</h5>;

      if ( ! left || ! right ) {
        foo = ( <div></div> );
      }

      let promoteMe = (
        <ColumnButtons key="left-buttons" item={ left } position='left' evaluated={ item } />
      );

      if ( ! left || ! right ) {
        promoteMe = ( <div></div> );
      }

      content.push(
        (
          <Header evaluation={ evaluation } />
        ),

        // big screens

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
              <ColumnSliders key="left-sliders"  item={ left } position='left' criterias={ criterias } />

              <ColumnSliders key="right-sliders" item={ right } position='right' criterias={ criterias } />

            </Row>

            { foo }

            <Row>
              { promoteMe }

              <ColumnButtons key="right-buttons" item={ right } position='right' evaluated={ item } />

            </Row>
          </div>
        ),

        // SMALL SCREENS

        // (
        //   <div data-screen="up-to-phone">
        //     <Row data-stack>
        //       <SideColumn key="left" position="left" item={ left } criterias={ criterias } next={ this.next.bind(this) } parent={ this } other={ right } />
        //
        //       <SideColumn key="right" position="right" item={ right } criterias={ criterias } next={ this.next.bind(this) } parent={ this } other={ left } />
        //     </Row>
        //   </div>
        // ),

        (
          <div className="gutter">
            <Finish cursor={ evaluation.cursor } limit={ evaluation.limit } evaluated={ item } />
          </div>
        )
      );
    }

    return (
      <section className={`item-promote ${this.props.className}`} ref="view">
        { content }
      </section>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export default Promote;
