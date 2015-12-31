'use strict';

const label = 'Go to home page';

export default props => describe => describe(label, it => {
  const url = `http://localhost:${props.port}`;

  it(`should go to ${url}`, () => props.driver.client.url(url));
});
