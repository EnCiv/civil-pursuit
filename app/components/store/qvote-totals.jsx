'use strict';

import React from 'react';
import update from 'immutability-helper';

class QVoteTotals extends React.Component {

  state = { finale: [] };

  constructor(props){
      super(props);
      if(this.props.panel && this.props.panel.items){
        this.props.panel.items.map((item, i)=>{ 
                let obj={item: item._id, index: i};
                Object.keys(this.props.shared.sections).forEach(sectionName=>{obj[sectionName]=0});
                this.state.finale.push(obj)
            });
        }
  }


  componentDidMount () {
        if(this.props.panel && this.props.panel.items){
            this.props.panel.items.map(item=>{ 
                window.socket.emit('get qvote info', [item._id], false, this.okGetQVoteInfo.bind(this));
            });
        }
  }

    componentWillReceiveProps(newProps) { //just read in the new props and through out the old ones and fetch new votes
      var newFinale=[];
      if(this.props.panel && this.props.panel.items){
        this.props.panel.items.map((item, i)=>{ 
                let obj={item: item._id, index: i};
                Object.keys(this.props.shared.sections).forEach(sectionName=>{obj[sectionName]=0});
                newFinale.push(obj);
                window.socket.emit('get qvote info', [item._id], false, this.okGetQVoteInfo.bind(this));
            });
        this.setState({finale: newFinale});
        }
    }

  okGetQVoteInfo(accumulation) {
      newFinale=this.state.finale.slice(0);
      console.info("QVoteTotal got qvote info length",accumulation.length);
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
        this.setState({finale: newfinale});
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

export default QVoteStore;
