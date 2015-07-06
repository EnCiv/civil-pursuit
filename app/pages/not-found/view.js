'use strict';

import Layout from '../../components/layout/view';
import {Element} from 'cinco/dist';

class PageNotFound extends Layout {
  constructor(props) {
    props = props || {};

    props.title = props.title || 'Page not found';

    super(props);

    var main = this.find('#main').get(0);

    main.add(
      new Element('h1.gutter.warning').text(props.title),
      new Element('p.gutter').text(
        'We are sorry, your request could not be fulfilled because no relevant results were found.'),
      new Element('hr')
    );
  }
}

export default PageNotFound;
