'use strict';

import Webdriver from './webdriver';

const label = 'Create item';

export default props => describe => describe(label, it => {

  it('Create web driver', it => Webdriver.start(props)(it));

  it('Issue', it => {

    const create = new Create(props.driver, selectors.topLevelPanel);

    it('should')

  });

});
