'use strict';

import {Element} from 'cinco/dist';
import config from '../../../config.json';
import Page from '../../lib/app/page';

class Footer extends Element {
  constructor (props) {
    super('footer.padding')
    this.props = props
    this.add(
      new Element('p').text(function () {
        var y = new Date().getFullYear();

        return 'Copyright Ⓒ 2014 ' +
          (y > 2014 ? " - " + y : "") +
          ' by Synaccord.'; }),

      new Element('p').add(
        new Element('a', {
          href    :   Page('Terms Of Service')
        })
          .text('Terms of Service and Privacy Policy'))
    )
  }
}

export default Footer
