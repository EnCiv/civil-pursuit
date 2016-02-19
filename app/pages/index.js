'use strict';

import { Document, Element, Elements }  from 'cinco/dist';
import publicConfig                     from '../../public.json';

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Stylesheet extends Element {
  constructor(href, attrs) {
    let attr = { rel : 'stylesheet', href };

    if ( attrs ) {
      for ( let k in attrs ) {
        attr[k] = attrs[k];
      }
    }

    super('link', attr);

    this.close();
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Script extends Element {
  constructor(src) {
    if ( src ) {
      super('script', { src });
    }
    else {
      super('script')
    }
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class GoogleAnalytics extends Element {
  constructor () {
    super('script');

    this.text(`(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create', "${publicConfig['google analytics'].key}", 'auto'); ga('send', 'pageview');`);
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Layout extends Document {
  constructor (props = {}) {
    super(props);

    this.props = props;

    const
      intro     =   JSON.stringify(this.props.intro),
      panels    =   JSON.stringify(this.props.panels || null);

    this.add(
      new Element('title').text('Synaccord | Bring synergy to democracy'),
      this.uACompatible(),
      this.viewport()
    );

    if ( props.env === 'development' ) {
      this.add(
        new Stylesheet('/assets/css/normalize.css', { name : 'stylesheet' }),
        new Stylesheet('/assets/css/index.css'),
        new Stylesheet('/assets/css/training.css'),
        new Stylesheet('/assets/bower_components/font-awesome/css/font-awesome.css'),
        new Stylesheet('/assets/bower_components/c3/c3.css')
      );
    }
    else {
      this.add(
        new Stylesheet('/assets/css/assets.min.css'),
        new Stylesheet('/assets/css/index.min.css'),
        new Stylesheet('/assets/css/training.min.css'),
        // new Stylesheet(publicConfig['font awesome'].cdn)
        new Stylesheet('/assets/bower_components/font-awesome/css/font-awesome.min.css')
      );
    }

    this.add(this.container());

    if ( props.react ) {
      this.add(
        new Script()
          .text('window.reactProps = ' + JSON.stringify(props.react) + '')
      );
    }

    this.add(new Script().text(`window.env = "${props.env}"; window.synappEnv = "${process.env.SYNAPP_ENV}"`));

    if ( props.env === 'development' ) {
      this.add(
        new Script('/socket.io/socket.io.js'),
        new Script('/assets/js/main.js'),
        new Script('/assets/js/socket.io-stream.js'),
        new Script('/assets/bower_components/d3/d3.js'),
        new Script('/assets/bower_components/c3/c3.js')
      );
    }

    else {
      this.add(
        new Script('/socket.io/socket.io.js'),
        new Script('/assets/js/main.min.js'),
        new Script('/assets/js/assets.min.js'),
        new GoogleAnalytics()
      );
    }
  }

  uACompatible () {
    return new Element('meta', {
      'http-equiv'    :     'X-UA-Compatible',
      content         :     'IE=edge'
    }).close();
  }

  viewport () {
    return new Element('meta', {
        name            :     'viewport',
        content         :     'width=device-width, initial-scale=1.0'
      })
      .close();
  }

  container () {
    return new Element('#synapp').text(this.props.rendered);
  }
}

export default Layout;
