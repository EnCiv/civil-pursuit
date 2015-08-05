'use strict'

import { Document, Element }  from 'cinco/dist';

import config                 from '../../../public.json';

import GoogleAnalytics        from '../google-analytics/view';
import Styles                 from '../styles/view';
import Scripts                from '../scripts/view';
import TopBar                 from '../top-bar/view';
import Footer                 from '../footer/view';
import Login                  from '../login/view';
import Join                   from '../join/view';
import ForgotPasswordView     from '../forgot-password/view';

class Layout extends Document {

  constructor (props) {
    super();
    this.props = props || {};
    console.log()
    console.log('Layout props', props)
    console.log()
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
      this.forgotPassword(),
      new Scripts(props)
    );
  }

  title () {

    let elem = new Element('title');

    if ( this.props.title ) {
      elem.text(config.title.prefix + this.props.title);
    }

    else if ( this.props.item ) {
      elem.text(config.title.prefix + this.props.item.subject);
    }

    else {
      elem.text(config.title.prefix + config.title.default);
    }

    return elem;
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

  forgotPassword () {
    return new Element('script#forgot-password', { type: 'text/html' })
      .condition(! this.props.user)
      .text(new ForgotPasswordView(this.props).render());
  }
}

export default Layout
