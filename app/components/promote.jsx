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
    return (
      <header className="text-center gutter-bottom">
        <h2>{ this.props.cursor } of { this.props.limit }</h2>
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
        <TextArea block placeholder="Can you provide feedback that would encourage the author to create a statement that more people would unite around?"></TextArea>
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
  render () {
    return (
      <Button block { ...this.props }><b>Neither</b></Button>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Promote extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);

    this.status = 'iddle';

    this.state = {
      cursor    :   1
    };
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentWillReceiveProps (props) {
    if ( props.show && this.status === 'iddle' ) {
      this.status = 'ready';
      this.get();
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  get () {
    if ( typeof window !== 'undefined' ) {
      window.socket.emit('get evaluation', this.props.item)
        .on('OK get evaluation', evaluation => {
          console.log('GOT EVALUATION', evaluation);
          let limit = 5;

          this.items = evaluation.items;

          this.setState({
            limit       :   limit,
            left        :   evaluation.items[0],
            right       :   evaluation.items[1],
            criterias   :   evaluation.criterias
          });
        })
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  next (position) {
    console.log('next', position);

    let { cursor, limit, left, right } = this.state;

    if ( cursor < limit ) {
      if ( ! position ) {
        cursor += 2;
      }

      else {
        cursor += 1;
      }

      switch ( position ) {
        case 'left' :
          right = this.items[cursor];
          break;
        case 'right':
          left = this.items[cursor];
          break;
        default:
          left = this.items[cursor-1];
          right = this.items[cursor];
          break;
      }

      let view = React.findDOMNode(this.refs.view);

      let top = view.getBoundingClientRect().top;
      let { pageYOffset } = window;

      // console.log('boom', top, window.);

      window.scrollTo(0, pageYOffset + top - 60);

      this.setState({ cursor, left, right });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {

    let content = ( <Loading /> );

    if ( this.state.limit ) {
      content = [];

      content.push(
        (
          <Header { ...this.state } />
        ),

        // big screens

        (
          <div data-screen="phone-and-up">
            <Row>
              <Column span="50" key="left-item" className="promote-left">
                <ItemMedia item={ this.state.left } />
                <Subject subject={ this.state.left.subject } />
                <Reference { ...this.state.left.references[0] } />
                <Description description={ this.state.left.description } />
              </Column>

              <Column span="50" key="right-item" className="promote-right">
                <ItemMedia item={ this.state.right } />
                <Subject subject={ this.state.right.subject } />
                <Reference { ...this.state.right.references[0] } />
                <Description description={ this.state.right.description } />
              </Column>
            </Row>

            <Row>
              <Column span="50" key="left-feedback" className="promote-left">
                <Feedback className="gutter-top" />
              </Column>

              <Column span="50" key="right-feedback" className="promote-right">
                <Feedback className="gutter-top" />
              </Column>
            </Row>

            <Row>
              <Column span="50" key="left-sliders" className="promote-left">
                <Sliders criterias={ this.state.criterias } className="promote-sliders" />
              </Column>

              <Column span="50" key="right-sliders" className="promote-right">
                <Sliders criterias={ this.state.criterias } className="promote-sliders" />
              </Column>

            </Row>

            <h5 data-screen="phone-and-up" className="text-center gutter">Which of these is most important for the community to consider?</h5>

            <Row>
              <Column span="50" key="left-buttons" className="promote-left">
                <PromoteButton { ...this.state.left } onClick={ this.next.bind(this, 'left') } className="gutter-bottom" />
                <EditAndGoAgain />
              </Column>

              <Column span="50" key="right-buttons" className="promote-right">
                <PromoteButton { ...this.state.right } onClick={ this.next.bind(this, 'right') } className="gutter-bottom" />
                <EditAndGoAgain />
              </Column>

            </Row>
          </div>
        ),

        // SMALL SCREENS

        (
          <div data-screen="up-to-phone">
            <Row data-stack>
              <Column span="50" key="left" className="promote-left">
                <ItemMedia item={ this.state.left } />
                <Subject subject={ this.state.left.subject } />
                <Reference { ...this.state.left.references[0] } />
                <Description description={ this.state.left.description } />
                <div style={{ clear: 'both' }} />
                <Sliders criterias={ this.state.criterias } className="promote-sliders" />
                <Feedback className="gutter-top" />
                <div data-screen="phone-and-down" className="gutter-top">
                  <PromoteButton { ...this.state.left } onClick={ this.next.bind(this, 'left') } className="gutter-bottom" />
                  <EditAndGoAgain />
                </div>
              </Column>

              <Column span="50" key="right" className="promote-right">
                <ItemMedia item={ this.state.right } />
                <Subject subject={ this.state.right.subject } />
                <Reference { ...this.state.right.references[0] } />
                <Description description={ this.state.right.description } />
                <div style={{ clear: 'both' }} />
                <Sliders criterias={ this.state.criterias } className="promote-sliders" />
                <Feedback className="gutter-top" />
                <div data-screen="phone-and-down" className="gutter-top">
                  <PromoteButton { ...this.state.right } onClick={ this.next.bind(this, 'right') } className="gutter-bottom" />
                  <EditAndGoAgain />
                </div>
              </Column>
            </Row>
          </div>
        ),
        (
          <div className="gutter">
            <Finish { ...this.state } onClick={ this.next.bind(this, null) } />
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
