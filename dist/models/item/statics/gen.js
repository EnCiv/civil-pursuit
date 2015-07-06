'use strict';

var marked0$0 = [gen].map(regeneratorRuntime.mark);
var taken = [1, 2, 3, 4, 5, 6];
var available = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function gen() {
  var i, r;
  return regeneratorRuntime.wrap(function gen$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        i = 0;
        r = undefined;

      case 2:
        if (!(taken.indexOf(available[i]) === -1)) {
          context$1$0.next = 7;
          break;
        }

        context$1$0.next = 5;
        return i;

      case 5:
        context$1$0.next = 2;
        break;

      case 7:
      case 'end':
        return context$1$0.stop();
    }
  }, marked0$0[0], this);
}

console.log('str', gen());