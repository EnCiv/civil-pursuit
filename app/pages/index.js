'use strict';

import { Document, Element, Elements } from 'cinco/dist';
import publicConfig from '../../public.json';

class Stylesheet extends Element {
  constructor(href) {
    super('link', { rel : 'stylesheet', href });
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
      this.uACompatible(),
      this.viewport()
    );

    if ( props.env === 'development' ) {
      this.add(
        new Stylesheet('/assets/css/normalize.css'),
        new Stylesheet('/assets/css/index.css'),
        new Stylesheet('/assets/bower_components/font-awesome/css/font-awesome.css'),
        new Stylesheet('/assets/bower_components/c3/c3.css'),
        new Stylesheet('/assets/bower_components/goalProgress/goalProgress.css')
      );
    }
    else {
      this.add(
        new Stylesheet('/assets/css/index.min.css'),
        new Stylesheet(publicConfig['font awesome'].cdn)
      );
    }

    this.add(this.container());

    this.add(new Script().text(`window.synapp = { "intro" : ${intro}}`));

    if ( props.env === 'development' ) {
      this.add(
        new Script('/socket.io/socket.io.js'),
        new Script('/assets/js/main.js'),
        new Script('/assets/js/socket.io-stream.js')
      );
    }

    else {
      this.add(
        new Script('/socket.io/socket.io.js'),
        new Script('/assets/js/main.min.js'),
        new Script('/assets/js/socket.io-stream.js')
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
