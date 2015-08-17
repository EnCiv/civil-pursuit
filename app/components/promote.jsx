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
  render () {
    let { item, position } = this.props;

    if ( ! item ) {
      return ( <div></div> );
    }

    return (
      <Column span="50" className={ `promote-${position}` }>
        <PromoteButton { ...item } onClick={ this.props.next.bind(this.props.parent, position) } className="gutter-bottom" />
        <EditAndGoAgain />
      </Column>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class SideColumn extends React.Component {
  render () {
    let { item, position, criterias } = this.props;

    if ( ! item ) {
      return ( <div></div> );
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
          <PromoteButton { ...item } onClick={ this.props.next.bind(this.props.parent, position) } className="gutter-bottom" />
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

    this.state = {
      cursor    :   1
    };
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentWillReceiveProps (props) {
    console.log('receiving props', props.show, this.status)
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

          if ( evaluation.items[0] ) {
            window.socket.emit('add view', evaluation.items[0]._id);
          }

          if ( evaluation.items[1] ) {
            window.socket.emit('add view', evaluation.items[1]._id);
          }

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

    let view = React.findDOMNode(this.refs.view);

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
          window.socket.emit('add view', right._id);
          break;

        case 'right':
          left = this.items[cursor];
          window.socket.emit('add view', left._id);
          break;


        default:
          left = this.items[cursor-1];

          if ( cursor > limit ) {
            cursor = limit;
            right = null;
          }
          else {
            right = this.items[cursor];
          }

          if ( left ) {
            window.socket.emit('add view', left._id);
          }

          if ( right ) {
            window.socket.emit('add view', right._id);
          }

          break;
      }

      let top = view.getBoundingClientRect().top;
      let { pageYOffset } = window;

      window.scrollTo(0, pageYOffset + top - 60);

      this.setState({ cursor, left, right });
    }

    else {
      this.setState({
        limit       :   0,
        left        :   {},
        right       :   {},
        criterias   :   [],
        cursor      :   1
      });

      this.status = 'iddle';

      view.closest('.item').querySelector('.toggle-details').click();
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
              <ColumnItem item={ this.state.left } position='left' key='item-left' />

              <ColumnItem item={ this.state.right } position='right' key='item-right' />
            </Row>

            <Row>
              <ColumnFeedback key="left-feedback" item={ this.state.left } position='left' />

              <ColumnFeedback key="right-feedback" item={ this.state.right } position='right' />
            </Row>

            <Row>
              <ColumnSliders key="left-sliders"  item={ this.state.left } position='left' criterias={ this.state.criterias } />

              <ColumnSliders key="right-sliders" item={ this.state.right } position='right' criterias={ this.state.criterias } />

            </Row>

            <h5 data-screen="phone-and-up" className="text-center gutter">Which of these is most important for the community to consider?</h5>

            <Row>
              <ColumnButtons key="left-buttons" item={ this.state.left } position='left' next={ this.next.bind(this) } parent={ this } />

              <ColumnButtons key="right-buttons" item={ this.state.right } position='right' next={ this.next.bind(this) } parent={ this } />

            </Row>
          </div>
        ),

        // SMALL SCREENS

        (
          <div data-screen="up-to-phone">
            <Row data-stack>
              <SideColumn key="left" position="left" item={ this.state.left } criterias={ this.state.criterias } next={ this.next.bind(this) } parent={ this } />

              <SideColumn key="right" position="right" item={ this.state.right } criterias={ this.state.criterias } next={ this.next.bind(this) } parent={ this } />
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
