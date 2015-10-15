'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Popularity = (function () {
  function Popularity(number, views, promotions) {
    _classCallCheck(this, Popularity);

    this.number = number;
    this.views = views;
    this.promotions = promotions;
    this.ok = typeof number === 'number' && isFinite(number) && number <= 100 && number >= 0;
  }

  _createClass(Popularity, [{
    key: 'toString',
    value: function toString() {
      if (this.ok) {
        return this.number.toString() + '%';
      }

      return '50%';
    }
  }], [{
    key: 'getPopularity',
    value: function getPopularity() {
      var multiplyBy100 = this.promotions * 100;

      if (multiplyBy100 === 0) {
        return new Popularity(0, this.views, this.promotions);
      }

      var divideByViews = Math.ceil(multiplyBy100 / this.views);

      return new Popularity(divideByViews, this.views, this.promotions);
    }
  }]);

  return Popularity;
})();

var getPopularity = Popularity.getPopularity;
exports['default'] = getPopularity;
exports.Popularity = Popularity;