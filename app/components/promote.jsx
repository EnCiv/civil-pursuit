'use strict';

import React from 'react';
import Row from './util/row';
import Column from './util/column';
import ItemMedia from './item-media';
import Loading from './util/loading';
import Sliders from './sliders';

class Header extends React.Component {
  render () {
    return (
      <header className="promote-steps">
        <h2>{ this.props.cursor } of { this.props.limit }</h2>
        <h4>Evaluate each item below</h4>
      </header>
    );
  }
}

class Subject extends React.Component {
  render () {
    return (
      <h4>{ this.props.subject }</h4>
    );
  }
}

class Description extends React.Component {
  render () {
    return (
      <section>{ this.props.description }</section>
    );
  }
}

class Reference extends React.Component {
  render () {
    return (
      <h5>
        <a href={ this.props.url } rel="nofollow" target="_blank">{ this.props.title || this.props.url }</a>
      </h5>
    );
  }
}

class Promote extends React.Component {
  constructor (props) {
    super(props);

    this.status = 'iddle';

    this.state = {
      cursor    :   1
    };
  }

  componentWillReceiveProps (props) {
    if ( props.show && this.status === 'iddle' ) {
      this.status = 'ready';
      this.get();
    }
  }

  get () {
    if ( typeof window !== 'undefined' ) {
      window.socket.emit('get evaluation', this.props.item)
        .on('OK get evaluation', evaluation => {
          console.log('GOT EVALUATION', evaluation);
          let limit = 5;

          this.setState({
            limit       :   limit,
            left        :   evaluation.items[0],
            right       :   evaluation.items[1],
            criterias   :   evaluation.criterias
          });
        })
    }
  }

  render () {

    let content = ( <Loading /> );

    if ( this.state.limit ) {
      content = [];

      content.push(
        ( <Header { ...this.state } className="text-center" /> ),
        (
          <Row>
            <Column span="50" key="left">
              <ItemMedia item={ this.state.left } />
              <Subject subject={ this.state.left.subject } />
              <Reference { ...this.state.left.references[0] } />
              <Description description={ this.state.left.description } />
              <div style={{ clear: 'both' }} />
              <Sliders criterias={ this.state.criterias } />
            </Column>

            <Column span="50" key="right">
              <ItemMedia item={ this.state.right } />
              <Subject subject={ this.state.right.subject } />
              <Reference { ...this.state.right.references[0] } />
              <Description description={ this.state.left.description } />
              <div style={{ clear: 'both' }} />
              <Sliders criterias={ this.state.criterias } />
            </Column>
          </Row>
        )
      );
    }

    return (
      <section className="promote">
        { content }
      </section>
    );
  }
}

export default Promote;
