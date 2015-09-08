'use strict';

import { Document, Element, Elements } from 'cinco/dist';
import publicConfig from '../../public.json';

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

class Layout extends Document {
  constructor (props = {}) {
    console.log(props);

    super(props);
    this.props = props;

    let intro = JSON.stringify(this.props.intro);

    this.add(
      new Element('title').text('Synaccord | Bring synergy to democracy'),
      this.uACompatible(),
      this.viewport(),
      new Element('meta', { 'blocking' : 'io' }).close()
    );

    if ( props.env === 'development' ) {
      this.add(
        new Stylesheet('/assets/css/normalize.css', { name : 'stylesheet' }),
        new Stylesheet('/assets/css/index.css'),
        new Stylesheet('/assets/bower_components/font-awesome/css/font-awesome.css'),
        new Stylesheet('/assets/bower_components/c3/c3.css')
      );
    }
    else {
      this.add(
        new Stylesheet('/assets/css/assets.min.css'),
        new Stylesheet('/assets/css/index.min.css'),
        new Stylesheet(publicConfig['font awesome'].cdn),
        new Element('style').text(props.css)
      );
    }

    this.add(this.container());

    this.add(new Script().text(`window.synapp = { "intro" : ${intro}}`));

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
        new Script('/assets/js/assets.min.js')
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
    return new Element('#synapp').text('<!-- #synapp -->');
  }
}

export default Layout;
