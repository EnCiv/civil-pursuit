'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cincoDist = require('cinco/dist');

var Promote = (function (_Element) {
  function Promote(props) {
    _classCallCheck(this, Promote);

    _get(Object.getPrototypeOf(Promote.prototype), 'constructor', this).call(this, 'section');

    this.props = props || {};

    this.add(this.compose());
  }

  _inherits(Promote, _Element);

  _createClass(Promote, [{
    key: 'promoteImage',
    value: function promoteImage(hand) {
      return new _cincoDist.Element('.image.gutter', {
        style: 'float: left; width: 40%',
        className: [hand + '-item']
      });
    }
  }, {
    key: 'promoteSubject',
    value: function promoteSubject(hand) {
      return new _cincoDist.Element('.subject.gutter', {
        className: [hand + '-item']
      }).add(new _cincoDist.Element('h4'));
    }
  }, {
    key: 'promoteDescription',
    value: function promoteDescription(hand) {
      return new _cincoDist.Element('.description.gutter.pre-text', {
        className: [hand + '-item']
      });
    }
  }, {
    key: 'promoteReference',
    value: function promoteReference(hand) {
      return new _cincoDist.Element('.references.gutter', {
        className: [hand + '-item']
      }).add(new _cincoDist.Element('a', {
        rel: 'nofollow',
        target: '_blank'
      }));
    }
  }, {
    key: 'promoteSliders',
    value: function promoteSliders(hand) {

      var sliders = new _cincoDist.Element('.sliders', {
        className: [hand + '-item']
      });

      for (var i = 0; i < 4; i++) {
        var slider = new _cincoDist.Element('.criteria-wrapper.criteria-' + i);

        slider.add(new _cincoDist.Element('.row').add(new _cincoDist.Element('.tablet-40').add(new _cincoDist.Element('h4').add(new _cincoDist.Element('button.criteria-name.shy.block').text('Criteria'))), new _cincoDist.Element('.tablet-60', {
          style: 'margin-top: 2.5em'
        }).add(new _cincoDist.Element('input.block', {
          type: 'range',
          min: '-1',
          max: '1',
          value: '0',
          step: '1'
        }))));

        slider.add(new _cincoDist.Element('h5.criteria-description.row.watch-100.gutter'));

        sliders.add(slider);
      }

      return sliders;
    }
  }, {
    key: 'promoteFeedback',
    value: function promoteFeedback(hand) {
      return new _cincoDist.Element('.feedback', {
        className: [hand + '-item']
      }).add(new _cincoDist.Element('textarea.feedback-entry.block', {
        placeholder: 'Can you provide feedback that would encourage the author to create a statement that more people would unite around?'
      }));
    }
  }, {
    key: 'promoteButton',
    value: function promoteButton(hand) {
      return new _cincoDist.Element('.gutter', {
        className: [hand + '-item']
      }).add(new _cincoDist.Element('button.block.promote').text('Promote'));
    }
  }, {
    key: 'editAndGoAgain',
    value: function editAndGoAgain(hand) {
      return new _cincoDist.Element('.gutter', {
        className: [hand + '-item']
      }).add(new _cincoDist.Element('button.block.edit-and-go-again-toggle').text('Edit and go again'));
    }
  }, {
    key: 'compose',
    value: function compose() {
      return new _cincoDist.Elements().add(new _cincoDist.Element('header.promote-steps').add(new _cincoDist.Element('h2').add(new _cincoDist.Element('span.cursor').text('1'), new _cincoDist.Element('span').text(' of '), new _cincoDist.Element('span.limit').text('5')), new _cincoDist.Element('h4').text('Evaluate each item below')), new _cincoDist.Element('.items-side-by-side').add(
      // 1 column
      new _cincoDist.Element('.split-hide-up').add(this.promoteImage('left'), this.promoteSubject('left'), this.promoteDescription('left'), this.promoteReference('left'), this.promoteSliders('left'), this.promoteFeedback('left'), this.promoteButton('left'), this.editAndGoAgain('left'), this.promoteImage('right'), this.promoteSubject('right'), this.promoteDescription('right'), this.promoteReference('right'), this.promoteSliders('right'), this.promoteFeedback('right'), this.promoteButton('right'), this.editAndGoAgain('right')),

      // 2 columns
      new _cincoDist.Element('.split-hide-down').add(new _cincoDist.Element('.row').add(new _cincoDist.Element('.split-50.watch-100').add(this.promoteImage('left'), this.promoteSubject('left'), this.promoteDescription('left')), new _cincoDist.Element('.split-50.watch-100').add(this.promoteImage('right'), this.promoteSubject('right'), this.promoteDescription('right'))), new _cincoDist.Element('.row').add(new _cincoDist.Element('.split-50.watch-100').add(this.promoteReference('left')), new _cincoDist.Element('.split-50.watch-100').add(this.promoteReference('right'))), new _cincoDist.Element('.row').add(new _cincoDist.Element('.split-50.watch-100').add(this.promoteSliders('left')), new _cincoDist.Element('.split-50.watch-100').add(this.promoteSliders('right'))), new _cincoDist.Element('.row').add(new _cincoDist.Element('.split-50.watch-100').add(this.promoteFeedback('left')), new _cincoDist.Element('.split-50.watch-100').add(this.promoteFeedback('right'))), new _cincoDist.Element('h4.text-center.promote-label-choose').text('Which of these is most important for the community to consider?'), new _cincoDist.Element('.row').add(new _cincoDist.Element('.split-50.watch-100').add(this.promoteButton('left')), new _cincoDist.Element('.split-50.watch-100').add(this.promoteButton('right'))), new _cincoDist.Element('.row').add(new _cincoDist.Element('.split-50.watch-100').add(this.editAndGoAgain('left')), new _cincoDist.Element('.split-50.watch-100').add(this.editAndGoAgain('right')))), new _cincoDist.Element('button.finish.block').text('Neither')));
    }
  }]);

  return Promote;
})(_cincoDist.Element);

exports['default'] = Promote;
module.exports = exports['default'];