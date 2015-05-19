'use strict';

import {Element, Elements} from 'cinco';
import config from 'syn/config.json';

class Stylesheet extends Element {
  constructor (href) {
    super('link', { rel: 'stylesheet', type: 'text/css', href: href });
  }
}

class Stylesheets extends Element {
  
  constructor (props) {
    super('styles');
    this.props = props;
    this.add(
      this.reset(),
      this.app(),
      this.fontAwesome(),
      this.vex(),
      this.vexTheme(),
      this.c3(),
      this.tooltip(),
      this.goalProgress()
    );
  }

  reset () {
    return new Stylesheet(() => this.props.settings.env === 'production'
      ? '/css/normalize.min.css'
      : '/css/normalize.css');
  }

  app () {
    return new Stylesheet(() => this.props.settings.env === 'production'
      ? '/css/index.min.css'
      : '/css/index.css');
  }

  fontAwesome () {
    return new Stylesheet(() => this.props.settings.env === 'production'
      ? config['font awesome'].cdn
      : '/bower_components/font-awesome/css/font-awesome.css');
  }

  vex () {
    return new Stylesheet('/assets/vex-2.2.1/css/vex.css');
  }

  vexTheme () {
    return new Stylesheet('/assets/vex-2.2.1/css/vex-theme-flat-attack.css');
  }

  c3 () {
    return new Stylesheet(() => this.props.settings.env === 'production'
      ? '/css/c3.min.css'
      : '/bower_components/c3/c3.css');
  }

  tooltip () {
    return new Stylesheet(() => this.props.settings.env === 'production'
      ? '/css/tooltip.min.css'
      : '/assets/toolkit/tooltip.css');
  }

  goalProgress () {
    return new Stylesheet('/bower_components/goalProgress/goalProgress.css');
  }

}

export default Stylesheets
