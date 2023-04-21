'use strict';

import React                            from 'react';
import Component                        from '../lib/app/component';
import Slider                           from './slider';
import criteriaType                     from '../lib/proptypes/criteria';
import cloneDeep from 'lodash/cloneDeep';
import PropTypes from 'prop-types';

class Sliders extends React.Component {
  static propTypes = {
    criterias : PropTypes.arrayOf(criteriaType)
  };

  votes= [];

  constructor(props){
    super(props);
    this.props.criterias.forEach(criteria=>this.votes[criteria._id]=cloneDeep({item: this.props.itemId, user: this.props.user, criteria: criteria}));
    //onsole.info("Sliders.constructor", this.votes)
  }

  componentDidMount(){
    window.socket.emit('get votes', this.props.itemId, this.okGetVotes.bind(this));
  }

  okGetVotes(votes){
    //onsole.info("Sliders.gotVotes",votes)
    if(!votes) return;
    votes.forEach(vote=>this.votes[vote.criteria._id]=cloneDeep(vote));
    this.forceUpdate();  // were not using state here because most of this Object won't change anymore but we need to keep the object in this shape to write it back out again
  }

  onChange(criteriaId,value){
    this.votes[criteriaId].value=value;  // no need to force update because the data has already been updated in the child
    window.socket.emit('update votes',[this.votes[criteriaId]]);
  }

  //value={this.votes[criteria._id].value || 0}

  render () {
    const {criterias}=this.props;
    let sliders = criterias.map(criteria => (
      <Slider key={ criteria._id } criteria={ criteria }  onChange={this.onChange.bind(this,criteria._id)} />
    ));

    return (
      <div className={ Component.classList(this) }>
        { sliders }
      </div>
    );
  }
}

export default Sliders;
