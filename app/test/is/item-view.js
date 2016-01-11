'use strict';

function isItemView (driver, item) {
  return it => {

    const { client } = driver;

    const view = `#item-${item._id}`;

    it('should exist', () => { client.isExisting(view) });

  };
}

export default isItemView;
