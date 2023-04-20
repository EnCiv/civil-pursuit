'use strict';

import React from 'react';
import LogoutSpan from './logout-span';

class Footer extends React.Component {
  render () {
    return (
      <footer className="syn-footer">
        <div style={{display: "table", width: "100%"}} >
          <div style={{display: "table-cell", width: "33%"}} ></div>
          <div style={{display: "table-cell", width: "33%"}} >
            <p>
              Copyright © 2014 - { new Date().getFullYear() } by <a href="http://www.enciv.org" target="_blank">EnCiv, Inc a 501(c)(3) nonprofit.</a>
            </p>
          </div>
          <div style={{display: "table-cell", width: "33%", textAlign: "right"}}>
            <LogoutSpan user={this.props.user}/>
          </div>
        </div>
        <p>
          <a href="https://enciv.org/terms/">Terms</a>
        </p>
      </footer>
    );
  }
}

export default Footer;
