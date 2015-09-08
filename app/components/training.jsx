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

    const instruction = this.props.instructions[this.state.cursor];

    let tooltip = {
      element : React.findDOMNode(this.refs.view),
      offset : {},
      target : {
        element : document.querySelector(instruction.element),
        offset : {}
      },
      position : {}
    };

    tooltip.rect                    =   tooltip.element.getBoundingClientRect();
    tooltip.offset.top              =   tooltip.element.offsetTop;
    tooltip.offset.bottom           =   tooltip.element.offseBottom;
    tooltip.offset.left             =   tooltip.element.offsetLeft;
    tooltip.offset.right            =   tooltip.element.offsetRight;
    tooltip.offset.height           =   tooltip.element.offsetHeight;
    tooltip.offset.width            =   tooltip.element.offsetWidth;
    tooltip.target.rect             =   tooltip.target.element.getBoundingClientRect();
    tooltip.target.offset.top       =   tooltip.target.element.offsetTop;
    tooltip.target.offset.bottom    =   tooltip.target.element.offseBottom;
    tooltip.target.offset.left      =   tooltip.target.element.offsetLeft;
    tooltip.target.offset.right     =   tooltip.target.element.offsetRight;
    tooltip.target.offset.height    =   tooltip.target.element.offsetHeight;
    tooltip.target.offset.width     =   tooltip.target.element.offsetWidth;
    tooltip.arrow                   =   'bottom';

    tooltip.position.top = (tooltip.target.rect.top - tooltip.rect.height);
    tooltip.position.left = (tooltip.target.rect.left + (tooltip.target.rect.width / 2) - (tooltip.rect.width / 2));

    if ( tooltip.position.top < 0 ) {
      tooltip.position.top = tooltip.target.rect.top + tooltip.target.rect.height + 20;
      tooltip.arrow = 'top';
    }

    setTimeout(() => {
      console.log({tooltip});
      tooltip.element.style.top = (tooltip.position.top) + 'px';
      tooltip.element.style.left = (tooltip.position.left) + 'px';

      tooltip.element.classList.remove('syn-training-arrow-right');
      tooltip.element.classList.remove('syn-training-arrow-left');
      tooltip.element.classList.remove('syn-training-arrow-top');
      tooltip.element.classList.remove('syn-training-arrow-bottom');

      tooltip.element.classList.add(`syn-training-arrow-${tooltip.arrow}`);
    });
  }

  next () {
    this.setState({ cursor : this.state.cursor + 1 });
  }

  componentDidMount () {
    console.error('component did mount')
    if ( typeof window !== 'undefined' ) {
      setTimeout(() => {
        let view = React.findDOMNode(this.refs.view);
        if ( view ) {
          view.classList.add('show');
        }
      }, 100);
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
