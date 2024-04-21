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
          <ReactActionStatePath {...lessProps} >
               <RASPLayout children={children}/>
          </ReactActionStatePath>
      )
  }
}

class RASPLayout extends ReactActionStatePathClient {

  constructor(props) {
    super(props, 'key');  // itemId is the key for indexing to child RASP functions
    this.createDefaults();
    this.getTopBar=this.getTopBar.bind(this)
  }

  getTopBar(e){
    if(e){
      let topBar=e.getBannerNode();
      if(this.topBar!==topBar) {
        this.topBar=topBar;
        this.forceUpdate();
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const { user, setPath } = this.props;
    const myScrollbar = {};
    const {children, ...lessProps} = this.props;

    return (
      <section>
        <div id="fb-root"></div>
        <TopBar {...lessProps} ref={this.getTopBar}/>
          <ReactScrollBar style={myScrollbar} topBar={this.topBar}>
            <div className="should-have-a-children scroll-me">
              <section role="main">
                { React.Children.map(React.Children.only(children), child=>{
                      var newProps=Object.assign({},lessProps, {rasp: this.childRASP('truncated', "default")});
                      Object.keys(child.props).forEach(prop=>delete newProps[prop]);
                      return React.cloneElement(child, newProps, child.props.children)
                  })}
                <Footer user={user}/>
              </section>
            </div>
        </ReactScrollBar>
      </section>
    );
  }
}

export default Layout;
