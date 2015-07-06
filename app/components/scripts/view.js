'use strict';

import { Element, Elements }  from 'cinco/dist';
import config                 from '../../../config.json';
import S                      from 'string';

class Scripts extends Elements {
  
  constructor (props) {
    super();
    this.props = props || {};

    if ( this.isProd() ) {
      this.add(
        this.globals(),
        this.socketIO(),
        this.jQuery(),
        this.app(),
        this.assets()
      );
    }
    else {
      this.add(
        this.globals(),
        this.socketIO(),
        this.jQuery(),
        this.autogrow(),
        this.app(),
        this.vex(),
        this.socketStream(),
        this.goalProgress(),
        this.d3(),
        this.c3()
      );
    }
  }

  isProd () {
    return this.props.settings.env === 'production';
  }

  globals () {
    return new Element('script').text(() => {
      var synapp = { config: this.props.config, props: this.props };

      return 'window.synapp = ' + JSON.stringify(synapp);
    });
  }

  socketIO () {
    return new Element('script', { src : '/socket.io/socket.io.js' } );
  }

  socketStream () {
    return new Element('script', { src: '/assets/js/socket.io-stream.js' });
  }

  jQuery () {
    return new Element('script', { src: () =>
      this.props.settings.env === 'production'
        ? config.jquery.cdn
        : '/assets/bower_components/jquery/dist/jquery.js' });
  }

  autogrow  () {
    return new Element('script', { src: '/assets/js/autogrow.js' });
  }

  app () {
    return new Element('script', { src: () => {
      var ext = '.js';

      if ( this.isProd() ) {
        ext = '.min.js';
      }

      var page = this.props.page || 'home';

      return '/js/pages/' + S(page).humanize().slugify().s + '/bundle' + ext;
    }});
  }

  vex () {
    return new Element('script', {
      src : '/assets/assets/vex-2.2.1/js/vex.combined.min.js'
    });
  }

  goalProgress () {
    return new Element('script', { src : '/assets/bower_components/goalProgress/goalProgress.js' });
  }

  d3 () {
    return new Element('script', { src: () =>
      this.props.settings.env === 'production'
        ? '/assets/bower_components/d3/d3.min.js'
        : '/assets/bower_components/d3/d3.js' });
  }

  c3 () {
    return new Element('script', { src: () =>
      this.props.settings.env === 'production'
        ? '/assets/bower_components/c3/c3.min.js'
        : '/assets/bower_components/c3/c3.js' });
    }


  assets () {
    return new Element('script', { src : '/assets/js/assets.min.js' }); 
  }
}

export default Scripts;
