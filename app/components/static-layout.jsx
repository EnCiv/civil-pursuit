'use strict';

import React                          from 'react';
import TopBar                         from './top-bar';
import Footer                         from './footer';
import ReactScrollBar from './util/react-scrollbar';



export default class StaticLayout extends React.Component {

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
                      var newProps=Object.assign({},lessProps);
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

