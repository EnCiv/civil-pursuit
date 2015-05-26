'use strict'

import Layout from 'syn/components/Layout/View';
import {Element} from 'cinco/es5';

class PageNotFound extends Layout {
  constructor(props) {
    super(props);
    this.props = props;

    var main = this.find('#main').get(0);

    main.add(
      new Element('h1.gutter').text('Page not found'),
      new Element('p.gutter').text(
        'We are sorry, this page was not found.'),
      new Element('hr')
    );
  }
}

export default PageNotFound;
