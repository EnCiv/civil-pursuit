'use strict';

import React from 'react';
import update from 'immutability-helper';

class QVoteTotals extends React.Component {

  state = { finale: [] };

  constructor(props){
      super(props);
      if(this.props.shared.panel && this.props.shared.panel.items){
        this.props.shared.panel.items.map((item, i)=>{ 
                let obj={item: item._id, index: i};
                Object.keys(this.props.shared.sections).forEach(sectionName=>{obj[sectionName]=0});
                this.state.finale.push(obj)
            });
        }
  }


  componentDidMount () {
        if(this.props.shared.panel && this.props.shared.panel.items){
            var idList=[];
            this.props.shared.panel.items.map(item=>idList.push(item._id));
            window.socket.emit('get qvote info', idList, false, this.okGetQVoteInfo.bind(this));
        }
  }

    componentWillReceiveProps(newProps) { //just read in the new props and through out the old ones and fetch new votes
    console.info("qvote-totals: newProps");
      var newFinale=[];
      var idList=[];
      if(newProps.shared.panel && newProps.shared.panel.items){
        newProps.shared.panel.items.map((item, i)=>{ 
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

  renderChildren () {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, Object.assign({},this.props, this.state) )
    );
  }

  render () {
    return (
      <section>{ this.renderChildren() }</section>
    );
  }
}

export default QVoteTotals;
