'use strict';

import React from 'react';
import Button from './util/button';

class Training extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      training: [
        {
          element : '.syn-panel .toggle-creator',
          title : 'Create new topic',
          description: 'Click here to create a new topic'
        },

        {
          element : '.item-promotions',
          title : 'Promote item',
          description: 'Click here to promote item'
        }
      ],
      cursor : 0
    };
  }

  go () {
    let view = React.findDOMNode(this.refs.view);
    let training = this.state.training[this.state.cursor];
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
        view.classList.add('show');
      }, 1000);
      setTimeout(this.go.bind(this), 2000);
    }
  }

  componentDidUpdate () {
    if ( typeof window !== 'undefined' ) {
      if ( this.state.training[this.state.cursor] ) {
        this.go();
      }
      else {
        let view = React.findDOMNode(this.refs.view);
        view.classList.remove('show');
      }
    }
  }

  render () {
    let { training, cursor } = this.state;

    let current = training[cursor];

    if ( ! current ) {
      return ( <div id="syn-training" ref="view"></div> );
    }

    let { title, description } = current;

    let text = 'Next';

    if ( ! training[cursor +1] ) {
      text = 'Finish';
    }

    return (
      <div id="syn-training" ref="view">
        <h4>{ title }</h4>
        <div style={{ marginBottom : '10px' }}>{ description }</div>
        <Button info onClick={ this.next.bind(this) }>{ text }</Button>
      </div>
    );
  }
}

export default Training;
