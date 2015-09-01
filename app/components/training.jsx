'use strict';

import React from 'react';
import Button from './util/button';
import Icon from './util/icon';

class Training extends React.Component {

  constructor (props) {
    super(props);

    window.Dispatcher.emit('get instructions');

    this.state = { cursor : 0 };
  }

  go () {
    let view = React.findDOMNode(this.refs.view);
    let training = this.props.instructions[this.state.cursor];
    let target = document.querySelector(training.element);
    let pos = target.getBoundingClientRect();
    let dim = view.getBoundingClientRect();
    console.log({ pos, dim });
    view.style.top = (target.offsetTop - (view.offsetHeight / 2)) + 'px';
    view.style.right = (window.innerWidth - pos.left) + 'px';
    console.log(window.innerWidth, pos.right)
  }

  next () {
    this.setState({ cursor : this.state.cursor + 1 });
  }

  componentDidMount () {
    if ( typeof window !== 'undefined' ) {
      setTimeout(() => {
        let view = React.findDOMNode(this.refs.view);
        if ( view ) {
          view.classList.add('show');
        }
      }, 1000);
      setTimeout(this.go.bind(this), 3000);
    }
  }

  componentDidUpdate () {
    if ( typeof window !== 'undefined' ) {
      if ( this.props.instructions[this.state.cursor] ) {
        this.go();
      }
      else if ( this.props.instructions.length ) {
        this.close();
      }
    }
  }

  close () {
    let view = React.findDOMNode(this.refs.view);
    view.classList.remove('show');
  }

  render () {
    let { cursor } = this.state;

    if ( ! this.props.instructions.length ) {
      return ( <div></div> );
    }

    let { instructions } = this.props;

    let current = instructions[cursor];

    if ( ! current ) {
      return ( <div id="syn-training" ref="view"></div> );
    }

    let { title, description } = current;

    let text = 'Next';

    if ( ! instructions[cursor +1] ) {
      text = 'Finish';
    }

    return (
      <div id="syn-training" ref="view">
        <div className="syn-training-close">
          <Icon icon="times" onClick={ this.close.bind(this) } />
        </div>
        <h4>{ title }</h4>
        <div style={{ marginBottom : '10px' }}>{ description }</div>
        <Button info onClick={ this.next.bind(this) }>{ text }</Button>
      </div>
    );
  }
}

export default Training;
