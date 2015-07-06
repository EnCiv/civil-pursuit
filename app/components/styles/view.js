'use strict';

import {Element, Elements} from 'cinco/dist';
import config from '../../../config.json';

class Stylesheet extends Element {
  constructor (href) {
    super('link', { rel: 'stylesheet', type: 'text/css', href: href });
    this.close();
  }
}

class Stylesheets extends Element {
  
  constructor (props) {
    super('styles');
    this.props = props;
    this.add(
      this.reset(),
      this.assets(),
      this.app(),
      this.fontAwesome(),
      this.vex(),
      this.vexTheme(),
      this.c3(),
      this.tooltip(),
      this.goalProgress()
    );
  }

  isProd () {
    return this.props.settings.env === 'production';
  }

  reset () {
    if ( ! this.isProd() ) {
      return new Stylesheet('/assets/css/normalize.css');
    }
  }

  app () {
    return new Stylesheet(() => this.isProd()
      ? '/css/index.min.css'
      : '/css/index.css');
  }

  assets () {
    if ( this.isProd() ) {
      return new Stylesheet('/css/assets.min.css');
    }
  }

  fontAwesome () {
    return new Stylesheet(() => this.isProd()
      ? config['font awesome'].cdn
      : '/assets/bower_components/font-awesome/css/font-awesome.css');
  }

  vex () {
    if ( ! this.isProd() ) {
      return new Stylesheet('/assets/assets/vex-2.2.1/css/vex.css');
    }
  }

  vexTheme () {
    if ( ! this.isProd() ) {
      return new Stylesheet('/assets/assets/vex-2.2.1/css/vex-theme-flat-attack.css');
    }
  }

  c3 () {
    if ( ! this.isProd() ) {
      return new Stylesheet('/assets/bower_components/c3/c3.css');
    }
  }

  tooltip () {
    if ( ! this.isProd() ) {
      return new Stylesheet('/assets/assets/toolkit/tooltip.css');
    }
  }

  goalProgress () {
    if ( ! this.isProd() ) {
      return new Stylesheet('/assets/bower_components/goalProgress/goalProgress.css');
    }
  }

}

export default Stylesheets
