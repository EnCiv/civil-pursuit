'use strict';

import { Document, Element, Elements }  from 'cinco/dist';
import publicConfig                     from '../../public.json';

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


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

class ResponsiveFontSize extends Element {
  constructor () {
    super('script');
    this.text("if(navigator.userAgent.match(/iPhone|Android|Blackberry|Opera Mini|IEMobile/i)) {var e=document.getElementsByTagName('html')[0]; if(navigator.userAgent.match(/SM-N950U/)) e.style.fontSize='9px'; else e.style.fontSize='8px'}")
  }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Layout extends Document {
  constructor (props = {}) {
    super(props);

    this.props = props;

    const
      panels    =   JSON.stringify(this.props.panels || null);

    this.add(
      new Element('title').text('Civil Pursuit | Solutions to what Divides Us'),
      this.uACompatible(),
      this.viewport(),
      new ResponsiveFontSize(),
    );

    this.favicon();

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
        // new Stylesheet(publicConfig['font awesome'].cdn)
        new Stylesheet('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css')
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

    if ( ( props.browserConfig ) && 
         (
             ( props.browserConfig.browser.name=="chrome" && props.browserConfig.browser.version[0] >= 54)
          || ( props.browserConfig.browser.name=="safari" && props.browserConfig.browser.version[0] >= 11)
          || ( props.browserConfig.browser.name=="opera" && props.browserConfig.browser.version[0] >= 41)
          || ( props.browserConfig.browser.name=="firefox" && props.browserConfig.browser.version[0] >= 50)
         )
       ) {
      logger.info("index browser supports ES6");
    }else { //add polyfill only for broswers that need it
      this.add(
        new Script('/assets/js/polyfill.min.js')
      )
    }


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

  //----------- adapted from https://realfavicongenerator.net/
  favicon() {
    this.add(
      new Element('link', {rel : 'icon', type : 'image/png', href : 'assets/images/favicon-16x16.png', sizes: '16x16'} ).close(),
      new Element('link', {rel : 'icon', type : 'image/png', href : 'assets/images/favicon-32x32.png', sizes: '32x32'} ).close(),
      new Element('link', {rel : "apple-touch-icon", sizes: "180x180",  href: "assets/images/apple-touch-icon.png" } ).close(),
      new Element('link', {rel : "manifest",  href: "/assets/images/manifest.json"} ).close(),
      new Element('link', {rel : "mask-icon", href: "/assets/images/safari-pinned-tab.svg", color: "#3f038e"} ).close(),
      new Element('link', {rel : "shortcut icon", href: "/assets/images/favicon.ico" } ).close(),
      new Element('meta', {name: "msapplication-config", content: "/assets/images/browserconfig.xml"} ).close(),
      new Element('meta', {name: "theme-color", content: "#ffffff"} ).close()
    )
  }
}

export default Layout;
