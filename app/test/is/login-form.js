'use strict';

import selectors              from 'syn/../../selectors.json';

function isLoginForm (driver) {
  return it => {
    it('should be visible', () => driver.isVisible(selectors.login.form));
  };
}

export default isLoginForm;
