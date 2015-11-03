'use strict';

function getHarmony (a, b) {
  console.log({ a, b });

  const sum = a + b;

  if ( ! sum ) {
    return 0;
  }

  return Math.ceil((a / sum) * 100);
}

export default getHarmony;
