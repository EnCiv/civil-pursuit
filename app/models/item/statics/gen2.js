'use strict';

var marked0$0 = [gen].map(regeneratorRuntime.mark);
var taken = [1, 2, 3, 4, 5, 6];
var available = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function gen() {
  return regeneratorRuntime.wrap(function gen$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
      case 'end':
        return context$1$0.stop();
    }
  }, marked0$0[0], this);
}

console.log('str', gen());
