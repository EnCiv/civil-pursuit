'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import TopBar                         from './top-bar';
import Footer                         from './footer';
import Panel                          from './panel';
import ReactScrollBar from './util/react-scrollbar';
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';


class Layout extends React.Component {
  render() {
      const {children, ...lessProps}=this.props;
      return (
          <ReactActionStatePath {...lessProps} initialRASP={{key: "1"}} >
               <RASPLayout children={children}/>
          </ReactActionStatePath>
      )
  }
}

class RASPLayout extends ReactActionStatePathClient {

  constructor(props) {
    super(props, 'key');  // itemId is the key for indexing to child RASP functions
    this.createDefaults();
  }

  actionToState(action, rasp, source, defaultRASP, delta) {
    //find the section that the itemId is in, take it out, and put it in the new section
    var nextRASP={};
    if(Object.keys(delta).length){
      ; // do nothing but generate the nextRASP 
    } else
      return null;
    Object.assign(nextRASP, rasp, delta);
    nextRASP.pathSegment=null;
    return(nextRASP);
  }

  segmentToState=undefined; // explicitly there is no segmentToState function here. 

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  topBar=null;

  render () {
    const { user, setPath } = this.props;
    const myScrollbar = {};
    const {children, ...lessProps} = this.props;

    return (
      <section>
        <div id="fb-root"></div>
        <TopBar {...lessProps} ref={e=>{this.topBar=e && e.getBannerNode()}}/>
          <ReactScrollBar style={myScrollbar} topBar={this.topBar}>
            <div className="should-have-a-chidren scroll-me">
              <section role="main">
                { React.Children.map(React.Children.only(children), child=>{
                      var newProps=Object.assign({},lessProps, {rasp: this.childRASP('truncated', "1")});
                      Object.keys(child.props).forEach(prop=>delete newProps[prop]);
                      return React.cloneElement(child, newProps, child.props.children)
                  })}
                <Footer />
              </section>
            </div>
        </ReactScrollBar>
      </section>
    );
  }
}

export default Layout;
