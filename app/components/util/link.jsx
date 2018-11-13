'use strict';

import React from 'react';
import PropTypes from 'prop-types';

class Link extends React.Component {

  static propTypes  =     {
    go              :     PropTypes.string,
    href            :     PropTypes.string,
    then            :     PropTypes.func
  };

  static go (target) {
    return new Promise((ok, ko) => {
      try {
        window.history.pushState(null, null, target);
        ok();
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  go (e) {
    e.preventDefault();

    Link.go(this.props.to || this.props.href).then(() => {
      if ( this.props.onClick ) {
        this.props.onClick(e);
      }

      if ( this.props.then ) {
        this.props.then(e);
      }
    });
  }

  render () {
    return (
      <a { ...this.props } href={ this.props.to || this.props.href } onClick={ this.go.bind(this) }>
        { this.props.children }
      </a>
    );
  }
}

export default Link;
