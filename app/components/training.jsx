'use strict';

import React                        from 'react';
import superagent                   from 'superagent';
import Button                       from './util/button';
import Icon                         from './util/icon';
import instructionType              from '../lib/proptypes/instruction';
import userType                     from '../lib/proptypes/user';
import PropTypes from 'prop-types';

class Training extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes    =   {
    instructions      :  PropTypes.arrayOf(instructionType),
    user              :   userType
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  state               =   {
    cursor            :   0,
    loader            :   false,
    dontShowNextTime  :   false
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  ready = false;

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  cursor = -1;

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);

    // window.Dispatcher.emit('get instructions');
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

    const instruction   =   relevantInstructions[this.state.cursor];

    const tooltip       =   this.refs.view;


    let target          =   document.querySelector(instruction.element);

    if ( ! target ) {
      console.warn('Target not found', instruction.element);
      return this.next();
    }

    const rect = target.getBoundingClientRect();
    const { width, height } = rect;

    if ( ! width && ! height ) {
      const targets = document.querySelectorAll(instruction.element);
      if ( targets % 2 === 0 ) {
        target = targets[targets.length / 2];
      }
      else {
        target = targets[targets.length - 1];
      }
    }

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
        arrow.src='/assets/images/caret-top-white.png';
        arrow.style.top = (rectangles[position].top - 15) + 'px';
        arrow.style.left = ( rectangles[position].left + ( _tooltip_.width / 2 ) ) + 'px';
        break;

      case 'top':
        arrow.src='/assets/images/caret-bottom-white.png';
        arrow.style.top = (rectangles[position].top + _tooltip_.height - 5) + 'px';
        arrow.style.left = ( rectangles[position].left + ( _tooltip_.width / 2 ) ) + 'px';
        break;

      case 'left':
        arrow.src='/assets/images/caret-right-white.png';
        arrow.style.top = ( rectangles[position].top + ( _tooltip_.height / 2 ) - 7 ) + 'px';
        arrow.style.left = ( rectangles[position].left + _tooltip_.width - 5) + 'px';
        break;

      case 'right':
        arrow.src='/assets/images/caret-left-white.png';
        arrow.style.top = ( rectangles[position].top + ( _tooltip_.height / 2 ) - 7 ) + 'px';
        arrow.style.left = ( rectangles[position].left - 14 ) + 'px';
        break;
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  next () {

    const active = document.querySelectorAll('.syn-training-active-target');

    this.refs.view.style.transitionDuration='.75s';

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

    var intro = document.querySelector('#syn-intro');

    if (intro == null)
    { intro=document.querySelector('#syn-panel-items');
    }

    const view = this.refs.view;

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
        view.style.transitionDuration='2s';
        var bottomAnchor = document.querySelector('a[name*="bottom-anchor"]');
        if(bottomAnchor) bottomAnchor.style.marginTop= view.offsetHeight + 40 + 'px';
            this.go();
          }, 8000);
        }

    if ( image ) {
      if ( image.complete ) {
        onLoad();
      }
      else {
        image.addEventListener('load', onLoad);
      }
    }
    else if ( video ) {
      video.addEventListener('load', onLoad);
    } else {
      onLoad ();
    }


  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount () {
    if ( typeof window !== 'undefined' ) {
      let view = this.refs.view;

      if ( view ) {
        this.init();
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidUpdate () {
    if ( typeof window !== 'undefined' ) {

      if ( ! this.ready ) {
        let view = this.refs.view;

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
    let view = this.refs.view;
    view.classList.remove('show');
    const active = document.querySelectorAll('.syn-training-active-target');

    for ( let i = 0; i < active.length ; i ++ ) {
      active[i].classList.remove('syn-training-active-target');
    }

    const arrow = document.querySelector('#syn-training-arrow');

    if ( arrow ) {
      arrow.style.left = '-1000vh';
    }

    // if ( this.state.dontShowNextTime ) {
    //   superagent.get('/settings?showtraining=0').end((err, res) => {});
    // }

    var bottomAnchor = document.querySelector('a[name*="bottom-anchor"]');
    if(bottomAnchor) bottomAnchor.style.marginTop= '0';
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  showNextTime (e) {
    this.setState({ dontShowNextTime : e.target.value });

    if ( e.target.value === 'on' ) {
      superagent.get('/settings?showtraining=0').end((err, res) => {});
    }
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
          <div className="syn-training-close" onClick={ this.close.bind(this) }>
            <Icon icon="times" />
          </div>
          <h4 className="syn-training-title">{ title }</h4>

          <div>
            <div style={{ marginBottom : '10px' }}>{ description }</div>
            <div style={{ float : 'right', marginTop : '15px' }}>
              <input
                type              =   "checkbox"
                defaultChecked    =   { this.state.dontShowNextTime }
                onChange          =   { this.showNextTime.bind(this) }
                name              =   "do-not-show-next-time"
                /> <em>Do not show next time</em>
            </div>
            <Button
              info
              onClick     =   { this.next.bind(this) }
              ref         =   "button"
              disabled    =   { this.state.loader }
              className   =   "syn-training-next"
              >{ text }</Button>
          </div>

        </div>
        <img src="/assets/images/caret-bottom-white.png" id="syn-training-arrow" />
      </section>
    );
  }
}

export default Training;
