'use strict';

import React from 'react';

class Footer extends React.Component {
  render () {
    return (
      <footer className="syn-footer">
        <p>
          Copyright © 2014 - { new Date().getFullYear() } by <a href="http://www.synaccord.com" target="_blank">Synaccord, LLC.</a>
        </p>
        <p>
          <a href="/page/terms-of-service">Terms of Service</a> and <a href="/page/privacy-policy">Privacy Policy</a>
        </p>
      </footer>
    );
  }
}

export default Footer;
