'use strict';

import React from 'react';
import update from 'immutability-helper';

class QVoteTotals extends React.Component {

  state = { finale: [] };

  constructor(props){
      super(props);
      if(this.props.shared.items){
        this.props.shared.items.map((item, i)=>{ 
                let obj={item: item._id, index: i};
                Object.keys(this.props.shared.sections).forEach(sectionName=>{obj[sectionName]=0});
                this.state.finale.push(obj)
            });
        }
  }


  componentDidMount () {
        if(this.props.shared && this.props.shared.items){
            var idList=[];
            this.props.shared.items.map(item=>idList.push(item._id));
            window.socket.emit('get qvote info', idList, false, this.okGetQVoteInfo.bind(this));
        }
  }

    componentWillReceiveProps(newProps) { //just read in the new props and through out the old ones and fetch new votes
    console.info("qvote-totals: newProps");
      var newFinale=[];
      var idList=[];
      if(newProps.shared && newProps.shared.items){
        newProps.shared.items.map((item, i)=>{ 
                let obj={item: item._id, index: i};
                Object.keys(newProps.shared.sections).forEach(sectionName=>{obj[sectionName]=0});
                newFinale.push(obj);
                idList.push(item._id);
            });
        window.socket.emit('get qvote info', idList, false, this.okGetQVoteInfo.bind(this));
        this.setState({finale: newFinale});
        }
    }

  okGetQVoteInfo(accumulation) {
      var newFinale=this.state.finale.slice(0);
      console.info("QVoteTotal got qvote info length,accumulation.length");
      if(accumulation.length){
        accumulation.forEach(qvote => {
            newFinale.some((qobj, i)=>{
                if(qobj.item===qvote.item){
                    Object.assign(newFinale[i],qvote.results);
                    return true;
                } else 
                return false;
            })
        })
        newFinale.sort((a,b)=>{return (b.most - a.most);})  // sort so largest most is first in list
        this.setState({finale: newFinale});
      }
  }

    renderChildren(moreProps) {
        return React.Children.map(this.props.children, (child, i) => {
            var {children, ...newProps} = this.props;
            Object.assign(newProps, this.state, moreProps);
            return React.cloneElement(child, newProps, child.props.children)
        });
    }

  render () {
    return (
      <section>{ this.renderChildren() }</section>
    );
  }
}

export default QVoteTotals;
