'use strict';

const label = 'Stop Selenium driver';

export default props => describe => describe(label, it => {
  it('should stop driver', () => props.driver.quit());
});
