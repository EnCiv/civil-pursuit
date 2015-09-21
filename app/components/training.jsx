'use strict';

import React                from 'react';
import Button               from './util/button';
import Icon                 from './util/icon';

class Training extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);

    window.Dispatcher.emit('get instructions');

    this.state = { cursor : 0, loader : false };

    this.ready = false;

    this.cursor = -1;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  go () {

    if ( this.cursor === this.state.cursor ) {
      return;
    }

    this.cursor = this.state.cursor;

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

    const tooltip = React.findDOMNode(this.refs.view);
    const target = document.querySelector(instruction.element);

    const arrow = document.querySelector('#syn-training-arrow');

    target.classList.add('syn-training-active-target');

    const _target_ = target.getBoundingClientRect();
    const _tooltip_ = tooltip.getBoundingClientRect();

    const rectangles = {
      top : {
        left : _target_.left + ( _target_.width / 2 ) - ( _tooltip_.width / 2 ) - 20,
        top : window.pageYOffset + _target_.top - ( _tooltip_.height ) - 20
      },
      bottom : {
        left : _target_.left + ( _target_.width / 2 ) - ( _tooltip_.width / 2 ),
        top : window.pageYOffset + _target_.top + ( _target_.height ) + 20
      },
      left : {
        left : _target_.left - _tooltip_.width - 30,
        top : window.pageYOffset + _target_.top + ( _target_.height / 2 ) - ( _tooltip_.height / 2 )
      },
      right : {
        left : _target_.right + 30,
        top : window.pageYOffset + _target_.top + ( _target_.height / 2 ) - ( _tooltip_.height / 2 )
      }
    };

    let position = 'top';

    if ( rectangles.top.top < 60 ) {
      position = 'bottom';
    }

    if ( window.innerWidth > 400 ) {
      if ( (rectangles.top.left + _tooltip_.width ) > window.innerWidth && (_tooltip_.width + 100) < window.innerWidth ) {
        position = 'left';
      }

      if ( rectangles.top.left < 0 && (_tooltip_.width + 100) < window.innerWidth ) {
        position = 'right';
      }

      tooltip.style.left = rectangles[position].left + 'px';
    }

    else {
      tooltip.style.left = '0px';
      tooltip.style.width = '91%';
    }

    tooltip.style.top = rectangles[position].top + 'px';

    tooltip.querySelector('button').blur();

    setTimeout(() => {
      tooltip.querySelector('button').focus();
    });

    arrow.classList.remove('fa-caret-up');
    arrow.classList.remove('fa-caret-down');
    arrow.classList.remove('fa-caret-left');
    arrow.classList.remove('fa-caret-right');

    switch ( position ) {
      case 'bottom':
        arrow.classList.add('fa-caret-up');
        arrow.style.top = (rectangles[position].top - 43) + 'px';
        arrow.style.left = ( rectangles[position].left + ( _tooltip_.width / 2 ) ) + 'px';
        break;

      case 'top':
        arrow.classList.add('fa-caret-down');
        arrow.style.top = (rectangles[position].top + _tooltip_.height - 23) + 'px';
        arrow.style.left = ( rectangles[position].left + ( _tooltip_.width / 2 ) ) + 'px';
        break;

      case 'left':
        arrow.classList.add('fa-caret-right');
        arrow.style.top = ( rectangles[position].top + ( _tooltip_.height / 2 ) - 30 ) + 'px';
        arrow.style.left = ( rectangles[position].left + _tooltip_.width - 1) + 'px';
        break;

      case 'right':
        arrow.classList.add('fa-caret-left');
        arrow.style.top = ( rectangles[position].top + ( _tooltip_.height / 2 ) - 30 ) + 'px';
        arrow.style.left = ( rectangles[position].left - 23 ) + 'px';
        break;
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  next () {

    const active = document.querySelectorAll('.syn-training-active-target');

    for ( let i = 0; i < active.length ; i ++ ) {
      active[i].classList.remove('syn-training-active-target');
    }

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

    const current = relevantInstructions[cursor];


    console.log({ current })

    if ( current.click ) {
      const { click } = current;
      const target = document.querySelector(click);

      const next = () => {
        this.setState({ cursor : this.state.cursor + 1, loader : false });
      };

      if ( current.listen ) {
        window.Emitter.once(current.listen, next.bind(this));
      }
      else {
        setTimeout(next.bind(this), ( 'wait' in current ) ? current.wait : 1500);
      }

      target.click();

      this.setState({ loader : true });
    }

    else {
      this.setState({ cursor : this.state.cursor + 1 });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  init () {

    let media;

    const intro = document.querySelector('#syn-intro');

    const view = React.findDOMNode(this.refs.view);

    const image = intro.querySelector('img');

    const video = intro.querySelector('iframe');

    if ( video ) {
      media = intro.querySelector('.video-container');
    }
    else {
      media = image;
    }

    const onLoad = () => {
      setTimeout(() => {
        this.ready = true;
        view.classList.add('show');
        this.go();
      }, 1000);
    }

    if ( image ) {
      if ( image.complete ) {
        onLoad();
      }
      else {
        image.addEventListener('load', onLoad);
      }
    }
    else {
      video.addEventListener('load', onLoad);
    }


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
    const active = document.querySelectorAll('.syn-training-active-target');

    for ( let i = 0; i < active.length ; i ++ ) {
      active[i].classList.remove('syn-training-active-target');
    }

    const arrow = document.querySelector('#syn-training-arrow');
    arrow.style.left = '-1000vh';
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let { cursor, loader } = this.state;

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

    let content ;

    return (
      <section>
        <div id="syn-training" data-loading={ this.state.loader ? '1' : '0' } ref="view">
          <div className="syn-training-close">
            <Icon icon="times" onClick={ this.close.bind(this) } />
          </div>
          <h4>{ title }</h4>

          <div>
            <div style={{ marginBottom : '10px' }}>{ description }</div>
            <Button
              info
              onClick   =   { this.next.bind(this) }
              ref       =   "button"
              disabled  =   { this.state.loader }
              >{ text }</Button>
          </div>

        </div>
        <Icon icon="caret-up" id="syn-training-arrow" size="4" />
      </section>
    );
  }
}

export default Training;
