'use strict';

import selectors              from 'syn/../../selectors.json';

function isJoinForm (driver) {
  return it => {
    it('should be visible', () => driver.isVisible(selectors.join.form));
  };
}

export default isJoinForm;
