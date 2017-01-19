'use strict';

import React from 'react';

class Footer extends React.Component {
  render () {
    return (
      <footer className="syn-footer">
        <p>
          Copyright © 2014 - { new Date().getFullYear() } by <a href="http://www.synaccord.com">Synaccord, LLC.</a>
        </p>
        <p>
          <a href="/page/terms-of-service">Terms of Service and Privacy Policy</a>
        </p>
      </footer>
    );
  }
}

export default Footer;
