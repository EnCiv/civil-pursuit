'use strict';

import WebDriver from '../../../lib/app/webdriver';

const label = 'Start new Selenium driver';

export default props => describe => describe(label, it => {

  it('should start a new driver', () => new Promise((ok, ko) => {
    props.driver = new WebDriver();
    props.driver.on('error', ko).on('ready', ok);
  }));

});
