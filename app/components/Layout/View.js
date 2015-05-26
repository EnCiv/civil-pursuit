'use strict'

import {Document, Element} from 'cinco/es5';

import config from 'syn/config';

import GoogleAnalytics  from 'syn/components/GoogleAnalytics/View';
import Styles           from 'syn/components/Styles/View';
import Scripts          from 'syn/components/Scripts/View';
import TopBar           from 'syn/components/TopBar/View';
import Footer           from 'syn/components/Footer/View';
import Login            from 'syn/components/Login/View';
import Join             from 'syn/components/Join/View';

class Layout extends Document {
  
  constructor (props) {
    super();
    this.props = props || {};
    this.add(
      this.title(),
      this.uACompatible(),
      this.viewport(),
      new GoogleAnalytics(props),
      new Styles(props),
      this.screens(),
      this.header(),
      this.main(),
      this.footer(),
      this.login(),
      this.join(),
      new Scripts(props)
    );
  }

  title () {
    return new Element('title').text(config.title);
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

  screens () {
    return new Element('#screens').add(
      new Element('#screen-phone'),
      new Element('#screen-tablet')
    );
  }

  header () {
    return new Element('section', { role: 'header' }).add(
      new TopBar(this.props)
    );
  }

  main () {
    return new Element('section#main', { role: 'main' });
  }

  footer () {
    return new Element('section#footer', { role: 'footer' }).add(
      new Footer(this.props)
    );
  }

  login () {
    return new Element('script#login', { type: 'text/html' })
      .condition(! this.props.user)
      .text(new Login(this.props).render());
  }

  join () {
    return new Element('script#join', { type: 'text/html' })
      .condition(! this.props.user)
      .text(new Join(this.props).render());
  }
}

export default Layout
