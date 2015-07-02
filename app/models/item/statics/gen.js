'use strict';

let taken         =   [1,2,3,4,5,6];
let available     =   [1,2,3,4,5,6,7,8,9];

function* gen () {
  let i = 0;
  let r;

  while ( taken.indexOf(available[i]) === -1 ) {
    yield i;
  }
}

console.log('str', gen());
