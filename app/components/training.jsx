'use strict';

import React from 'react';
import Button from './util/button';
import Icon from './util/icon';

class Training extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);

    window.Dispatcher.emit('get instructions');

    this.state = { cursor : 0 };

    this.ready = false;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  go () {

    const { instructions } = this.props;

    const relevantInstructions = instructions.filter(instruction => {
      if ( ! this.props.user ) {
        return ! instruction.in;
      }
      else {
        return true;
      }
    });

    const instruction = relevantInstructions[this.state.cursor];

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

    const { pageYOffset } = window;

    tooltip.position.top = (tooltip.target.rect.top - tooltip.rect.height - 20 +  + pageYOffset);
    tooltip.position.left = (tooltip.target.rect.left + (tooltip.target.rect.width / 2) - (tooltip.rect.width / 2));

    if ( tooltip.position.top < 0 ) {
      tooltip.position.top = tooltip.target.rect.top + tooltip.target.rect.height + 20;
      tooltip.arrow = 'top';
      tooltip.rect  = tooltip.element.getBoundingClientRect();
    }

    setTimeout(() => {
      console.log({tooltip});
      tooltip.element.style.top = (tooltip.position.top) + 'px';
      tooltip.element.style.left = (tooltip.position.left) + 'px';

      tooltip.rect = tooltip.element.getBoundingClientRect();

      const isTooCloseToRightMargin = ( window.innerWidth - tooltip.rect.right < 50 );
      const bottomShouldBeRight = ( tooltip.arrow === 'bottom' && tooltip.rect.right < tooltip.target.rect.left )
      const isBehindLeftMargin = ( tooltip.rect.left < 0 );

      if ( isTooCloseToRightMargin || bottomShouldBeRight ) {
        tooltip.position.top = (tooltip.target.rect.top - tooltip.rect.height + (tooltip.rect.height / 2) + 20);
        tooltip.position.right = (window.innerWidth - tooltip.target.rect.right + 40);
        tooltip.arrow = 'right';

        tooltip.element.style.top = (tooltip.position.top) + 'px';
        tooltip.element.style.left = 'auto';
        tooltip.element.style.right = (tooltip.position.right) + 'px';

        tooltip.rect = tooltip.element.getBoundingClientRect();
      }

      else if ( isBehindLeftMargin ) {
        tooltip.position.left = tooltip.target.rect.right;
        tooltip.position.top = tooltip.target.rect.top - (tooltip.rect.height / 2) + pageYOffset;
        tooltip.element.style.left = tooltip.position.left + 'px';
        tooltip.element.style.top = tooltip.position.top + 'px';
        tooltip.arrow = 'left';

        tooltip.rect = tooltip.element.getBoundingClientRect();
      }

      tooltip.element.classList.remove('syn-training-arrow-right');
      tooltip.element.classList.remove('syn-training-arrow-left');
      tooltip.element.classList.remove('syn-training-arrow-top');
      tooltip.element.classList.remove('syn-training-arrow-bottom');

      tooltip.element.classList.add(`syn-training-arrow-${tooltip.arrow}`);

      // let {top} = tooltip.rect;
      // let { pageYOffset } = window;
      //
      // window.scrollTo(0, pageYOffset + top - 60);
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  next () {
    const { cursor } = this.state;

    const { instructions } = this.props;

    const relevantInstructions = instructions.filter(instruction => {
      if ( ! this.props.user ) {
        return ! instruction.in;
      }
      else {
        return true;
      }
    });

    const current = instructions[cursor];

    if ( current.click ) {
      const { click } = current;
      const target = document.querySelector(click);
      target.click();
      setTimeout(() => this.setState({ cursor : this.state.cursor + 1 }), 1500);
    }

    else {
      this.setState({ cursor : this.state.cursor + 1 });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  init () {
    setTimeout(() => {
      this.ready = true;
      let view = React.findDOMNode(this.refs.view);
      console.info({ view })
      if ( view ) {
        view.classList.add('show');
      }
    }, 100);
    setTimeout(this.go.bind(this), 3000);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount () {
    if ( typeof window !== 'undefined' ) {
      let view = React.findDOMNode(this.refs.view);

      if ( view ) {
        this.init();
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidUpdate () {
    if ( typeof window !== 'undefined' ) {

      if ( ! this.ready ) {
        let view = React.findDOMNode(this.refs.view);

        if ( view ) {
          this.init();
        }
      }

      else {
        const { instructions } = this.props;

        const relevantInstructions = instructions.filter(instruction => {
          if ( ! this.props.user ) {
            return ! instruction.in;
          }
          else {
            return true;
          }
        });

        if ( relevantInstructions[this.state.cursor] ) {
          this.go();
        }
        else if ( relevantInstructions.length ) {
          this.close();
        }
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  close () {
    let view = React.findDOMNode(this.refs.view);
    view.classList.remove('show');
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let { cursor } = this.state;

    if ( ! this.props.instructions.length ) {
      return ( <div></div> );
    }

    const { instructions } = this.props;

    const relevantInstructions = instructions.filter(instruction => {
      if ( ! this.props.user ) {
        return ! instruction.in;
      }
      else {
        return true;
      }
    });

    let current = relevantInstructions[cursor];

    if ( ! current ) {
      return ( <div id="syn-training" ref="view"></div> );
    }

    let { title, description } = current;

    let text = 'Next';

    if ( ! relevantInstructions[cursor +1] ) {
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
