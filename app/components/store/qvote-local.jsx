'use strict';

import React from 'react';
import update from 'immutability-helper';
import merge from 'lodash/merge'

class QVoteLocal extends React.Component {

  state = { sections : {unsorted: []}};

  constructor(props){
      super(props);
      if(this.props.shared && this.props.shared.sections && this.props.shared.index){
        Object.keys(this.props.shared.sections).forEach(section => this.state.sections[section]=[] );
        Object.keys(this.props.shared.index).map(itemId=>this.state.sections['unsorted'].push(itemId));
        this.state.index=merge({},this.props.shared.index)
        }
  }

      componentWillReceiveProps(newProps) { //deleting items from sections that are nolonger in newProps is not a usecase
        let currentIndex = [];
        let unsortedLength = 0;
        var newObj = merge({}, this.state.sections);
        if (newProps.shared && newProps.shared.sections && newProps.shared.index) {
            Object.keys(newProps.shared.index).forEach((newItemId, i) => {
                if (!(newItemId in this.state.index)) {
                    newObj['unsorted'].push(newItemId);
                }
                currentIndex[newItemId] = i;
                unsortedLength++;
            });
        }
        if (unsortedLength) {
            var newIndex=merge({},currentIndex);
            this.setState({ 'sections': merge({}, newObj),
                            'index': newIndex});
        }
    }


      toggle(itemId, criteria) {
          //find the section that the itemId is in, take it out, and put it in the new section
          let i;
          let done = false;
          var clone = {};

          Object.keys(this.state.sections).forEach(
              sectionName => {
                  if (!done && ((i = this.state.sections[sectionName].indexOf(itemId)) !== -1)) {
                      if (sectionName === criteria) {
                          //take the i'th element out of the section it is in and put it back in unsorted
                          clone[criteria] = update(this.state.sections[criteria], { $splice: [[i, 1]] });
                          clone['unsorted'] = update(this.state.sections['unsorted'], { $unshift: [itemId] });
                          done = true;
                      } else if (sectionName === 'unsorted') {
                          // it was in unsorted, so take it out and put it where it in the criteria's section
                          clone['unsorted'] = update(this.state.sections['unsorted'], { $splice: [[i, 1]] });
                          if(this.state.sections[criteria]){
                             clone[criteria] = update(this.state.sections[criteria], { $unshift: [itemId] });
                          }else{
                             clone[criteria] = [itemId];
                          }
                          done = true;
                      } else { // the item is in some other sectionName and should be moved to this criteria's section
                          clone[sectionName] = update(this.state.sections[sectionName], { $splice: [[i, 1]] });
                          if(this.state.sections[criteria]){
                            clone[criteria] = update(this.state.sections[criteria], { $unshift: [itemId] });
                          } else {
                              clone[criteria] = [itemId];
                          }
                          done = true;
                      }
                  } else if (sectionName != criteria) {  // copy over the other sections but don't overwrite the one you are modifying
                      clone[sectionName] = this.state.sections[sectionName].slice();
                  }
              });
          if (!this.state.sections[criteria]) { clone[criteria] = [itemId]; }  // if the section for this criteria does not exist yet in state
          this.setState({ 'sections': clone });
      }


  okGetQVoteInfo(accumulation) {
      if(accumulation){
        accumulation.forEach(qvote => {
            if(qvote.ownVote) {
                this.toggle(qvote.item, qvote.ownVote);
            }
        });
      }
  }

  renderChildren () {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, Object.assign({},this.props, this.state, {toggle: this.toggle.bind(this)}) )
    );
  }

  render () {
    return (
      <section>{ this.renderChildren() }</section>
    );
  }
}

export default QVoteLocal;
