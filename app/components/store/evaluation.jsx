'use strict';

import { EventEmitter }   from 'events';
import React              from 'react';
import selectors          from '../../../selectors.json';
import screens            from '../../../screens.json';

class EvaluationStore extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  state = {
    evaluation : null,
    cursor : 1,
    limit : 5,
    left : null,
    right : null
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  emitter = new EventEmitter();

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount () {
    if ( ! this.state.evaluation ) {
      window.socket.emit(
        'get evaluation',
        this.props['item-id'],
        this.okGetEvaluation.bind(this)
      );
    }

    this.panelEmitter = this.props.emitter;

    this.emitter
      .on('next', this.next.bind(this))
      .on('promote', this.promote.bind(this));
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidUpdate () {
    if ( ! this.state.evaluation && this.props.active && this.props.active.item === this.props['item-id'] && this.props.active.section === 'promote' ) {
      window.socket.emit(
        'get evaluation',
        this.props['item-id'],
        this.okGetEvaluation.bind(this)
      );
    }
    if (document.getElementById('left_description') != null && document.getElementById('right_description') != null) {
        var ly = document.getElementById('left_description').offsetHeight;
        var ry = document.getElementById('right_description').offsetHeight;
        if (ly < ry) {
          document.getElementById('left_description').style.height = ry + "px";
        }
        else {
          document.getElementById('right_description').style.height = ly + "px";
        }  
    }

    if (document.getElementById('h5_left') != null && document.getElementById('h5_right') != null) {
        var ly = document.getElementById('h5_left').offsetHeight;
        var ry = document.getElementById('h5_right').offsetHeight;
        if (ly < ry) {
          document.getElementById('h5_left').style.height = ry + "px";
        }
        else {
          document.getElementById('h5_right').style.height = ly + "px";
        }  
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentWillUnmount () {
    this.emitter
      .removeListener('next', this.next.bind(this))
      .removeListener('promote', this.promote.bind(this));
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  okGetEvaluation (evaluation) {
    if ( evaluation.item === this.props['item-id'] ) {

      let limit = this.state.limti;

      switch ( evaluation.items.length ) {
        case 1: case 2: limit = 1; break;
        case 3: limit = 2; break;
        case 4: limit = 3; break;
        case 5: limit = 4; break;
        case 6: limit = 5; break;
      }

      let left, right;

      if ( evaluation.items[1] ) {
        right = evaluation.items[1];
        window.socket.emit('add view', evaluation.items[1]);
      }

      if ( evaluation.items[0] ) {
        left = evaluation.items[0];

        if ( right ) {
          window.socket.emit('add view', evaluation.items[0]);
        }
      }

      this.setState({ evaluation, limit, left, right });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  next () {
    let cursor = this.state.cursor;
    let regular = true;

    if ( cursor + 2 > this.state.limit ) {
      cursor += 1;
      regular = false;
    }
    else {
      cursor += 2;
    }

    let left, right;

    if ( this.state.left ) {
      this.insertVotes('left', this.state.left._id);
      this.insertFeedback('left', this.state.left._id);
    }

    if ( this.state.right ) {
      this.insertVotes('right', this.state.right._id);
      this.insertFeedback('right', this.state.right._id);
    }

    if ( cursor <= this.state.limit ) {
      document.getElementById('left_description').style.height = "auto";
      document.getElementById('right_description').style.height = "auto";

      left = this.state.evaluation.items[regular ? cursor - 1 : cursor];
      right = this.state.evaluation.items[regular ? cursor : cursor + 1];

      if ( left && right ) {
        window.socket.emit('add view', left);
        window.socket.emit('add view', right);
      }

      this.setState({ cursor, left, right });
    }
    else {
      this.setState({ evaluation : null, cursor : 1 });
      this.props.toggle('promote');
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  getScreen () {
    return window.innerWidth < screens.phone ? 'up-to-phone' : 'phone-and-up';
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  insertUpvotes(itemId) {
    let upvotes = [];
    const evaluation - this.state.evaluation.items;


    console.info("insertUpvotes", this.state, itemId );

    if ( this.state.evaluation && this.state.evaluation.items.length ) {
      var itm;

      for(itm in evaluation)
      {   console.info("insetUpvotes", itm )
          if(evaluation[itm]._id == itemId) {
            upvotes.push({
              item: evaluation[itm]._id,
               value: 1
            });
          } else {
            upvotes.push({
              item: evaluation[itm]._id,
              value: 0
            });
          }
      }

      console.info("insertUpvotes", this.state.evaluation, upvotes );

      window.socket.emit('insert upvotes', upvotes);
    }
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  insertVotes(position, itemId) {
    const sliders = React.findDOMNode(this.refs.view).querySelectorAll(`[data-screen="${this.getScreen()}"] .promote-${position} [type="range"]`);

    if ( sliders.length ) {
      const votes = [];

      for ( let i = 0; i < sliders.length; i ++ ) {
        const vote = sliders[i];

        votes.push({
          criteria  :   vote.dataset.criteria,
          value     :   vote.value,
          item      :   itemId
        });
      }

      console.log({ votes, sliders : sliders.length });

      window.socket.emit('insert votes', votes);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  insertFeedback(position, itemId) {
    console.info("insertFeedback", position, itemId, this.refs);
    console.info(`[data-screen="${this.getScreen()}"] .promote-${position} .user-feedback`);

    const feedback = React.findDOMNode(this.refs.view)
      .querySelector(`[data-screen="${this.getScreen()}"] .promote-${position} .user-feedback`);

    console.log('insert feedback', feedback);

    if ( feedback ) {
      window.socket.emit('insert feedback', this.state.evaluation.item, feedback.value);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  promote (position) {
    const opposite = position === 'left' ? 'right' : 'left';

    const cursor = this.state.cursor + 1;

    let right = this.state.right, left = this.state.left;

    if ( cursor > this.state.limit ) {
      window.socket.emit('promote', this.state[position]);
    }

    this.insertVotes(opposite, this.state[opposite]._id);

    if ( cursor <= this.state.limit ) {

      if ( left && right ) {
        window.socket.emit('add view', this.state[position]);
        window.socket.emit('add view', this.state[opposite]);
      }

      this.setState({
        cursor,
        [opposite] : this.state.evaluation.items[cursor]
      });
    }

    else {
      this.insertVotes(position, this.state[position]._id);
      this.insertUpvotes(this.state[position]._id);
      this.setState({ evaluation : null, cursor : 1 });
      this.props.toggle('promote');
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  renderChildren () {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, Object.assign({}, this.state, { emitter : this.emitter, panelEmitter : this.panelEmitter }))
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const attr = {};

    const dataset = {
      items : []
    };

    if ( this.state.evaluation ) {
      attr.id = selectors.evaluation.id.prefix.replace(/^#/, '') +
        this.state.evaluation.item;

      dataset.items = this.state.evaluation.items.map(item => item._id);
    }

    return (
      <section className={ selectors.evaluation.className } { ...attr } ref="view" data-items={ dataset.items.join(',') }>
        { this.renderChildren() }
      </section>
    );
  }
}

export default EvaluationStore;
