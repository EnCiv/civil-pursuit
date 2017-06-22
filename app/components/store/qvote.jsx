'use strict';

import React from 'react';
import update from 'immutability-helper';

class QVoteStore extends React.Component {

  state = { sections : {unsorted: []},
            index: [] };

  constructor(props){
      super(props);
      if(this.props.panel && this.props.panel.items){
        this.props.panel.items.map((item, i)=>{ 
                this.state.index[item._id]=i;
                this.state.sections['unsorted'].push(item._id);
            });
        }
  }

  componentDidMount () {
      var idList=[];
        if(this.props.panel && this.props.panel.items){
            this.props.panel.items.map(item=>idList.push(item._id));
            window.socket.emit('get qvote info', idList, true, this.okGetQVoteInfo.bind(this));
        }
  }

    cloneSections(section) {
        // Deep copy arrays.
        var clone = {};
        Object.keys(section).forEach(button => {
            clone[button] = section[button].slice(0);
        });
        return clone;
    }

      componentWillReceiveProps(newProps) { //deleting items from sections that are nolonger in newProps is not a usecase
        let currentIndex = [];
        let unsortedLength = 0;
        var idList=[];
        var newObj = this.cloneSections(this.state.sections);
        if (newProps.panel && newProps.panel.items) {
            newProps.panel.items.forEach((newItem, i) => {
                if (!(newItem._id in this.state.index)) {
                    newObj['unsorted'].push(newItem._id);
                    idList.push(newItem._id);
                }
                currentIndex[newItem._id] = i;
                unsortedLength++;
            });
        }
        if (unsortedLength) {
            window.socket.emit('get qvote info', idList, true, this.okGetQVoteInfo.bind(this));
            var newIndex=Object.assign({},currentIndex);
            this.setState({ 'sections': this.cloneSections(newObj),
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
      console.info("QVote got qvote info length",accumulation.length);
      if(accumulation){
        accumulation.forEach(qvote => {
            if(qvote.ownVote) {
                this.toggle(qvote.item, qvote.ownVote);
            }
        });
      }
  }

  renderChildren () {
      console.info('QVoteStore.renderChildren', this.props)
    return React.Children.map(this.props.children, child => {
      var newProps= Object.assign({}, this.props, this.state, {toggle: this.toggle.bind(this)});
      delete newProps.children;
      console.info('QVoteStore.renderChildren.map', newProps);
      React.cloneElement(child, newProps, child.props.children);
    });
  }

  render () {
    return (
      <section>{ this.renderChildren() }</section>
    );
  }
}

export default QVoteStore;
