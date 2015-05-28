'use strict';

import Layout from 'syn/components/Layout/View';
import {Element} from 'cinco/es5';

class ErrorPage extends Layout {
  constructor(props) {
    props = props || {};

    props.title = props.title || 'Error';

    super(props);

    var main = this.find('#main').get(0);

    main.add(new Element('h1.gutter.error').text(props.title));

    let ul = new Element('ul');

    if ( props.settings.env === 'development' ) {
      props.error.forEach(line => { ul.add(new Element('li').text(line)) });

      main.add(ul);
    }

    else {
      main.add(new Element('p').text('An error occurred. Please try again in a moment'));
    }

    main.add(new Element('hr')); 
  }
}

export default ErrorPage;
