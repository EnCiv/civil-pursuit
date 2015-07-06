'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cincoEs5 = require('cinco/es5');

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
      return new _cincoEs5.Element('.image.gutter', {
        style: 'float: left; width: 40%',
        className: [hand + '-item']
      });
    }
  }, {
    key: 'promoteSubject',
    value: function promoteSubject(hand) {
      return new _cincoEs5.Element('.subject.gutter', {
        className: [hand + '-item']
      }).add(new _cincoEs5.Element('h4'));
    }
  }, {
    key: 'promoteDescription',
    value: function promoteDescription(hand) {
      return new _cincoEs5.Element('.description.gutter.pre-text', {
        className: [hand + '-item']
      });
    }
  }, {
    key: 'promoteReference',
    value: function promoteReference(hand) {
      return new _cincoEs5.Element('.references.gutter', {
        className: [hand + '-item']
      }).add(new _cincoEs5.Element('a', {
        rel: 'nofollow',
        target: '_blank'
      }));
    }
  }, {
    key: 'promoteSliders',
    value: function promoteSliders(hand) {

      var sliders = new _cincoEs5.Element('.sliders', {
        className: [hand + '-item']
      });

      for (var i = 0; i < 4; i++) {
        var slider = new _cincoEs5.Element('.criteria-wrapper');

        slider.add(new _cincoEs5.Element('row').add(new _cincoEs5.Element('.tablet-40').add(new _cincoEs5.Element('h4').add(new _cincoEs5.Element('button.criteria-name.shy.block').text('Criteria'))), new _cincoEs5.Element('.tablet-60', {
          style: 'margin-top: 2.5em'
        }).add(new _cincoEs5.Element('input.block', {
          type: 'range',
          min: '-1',
          max: '1',
          value: '0',
          step: '1'
        }))));

        slider.add(new _cincoEs5.Element('.row.is-container.criteria-description-section').add(new _cincoEs5.Element('.is-section').add(new _cincoEs5.Element('.gutter.watch-100.criteria-description'))));

        sliders.add(slider);
      }

      return sliders;
    }
  }, {
    key: 'promoteFeedback',
    value: function promoteFeedback(hand) {
      return new _cincoEs5.Element('.feedback', {
        className: [hand + '-item']
      }).add(new _cincoEs5.Element('textarea.feedback-entry.block', {
        placeholder: 'Can you provide feedback that would encourage the author to create a statement that more people would unite around?'
      }));
    }
  }, {
    key: 'promoteButton',
    value: function promoteButton(hand) {
      return new _cincoEs5.Element('.gutter', {
        className: [hand + '-item']
      }).add(new _cincoEs5.Element('button.block.promote').text('Promote'));
    }
  }, {
    key: 'editAndGoAgain',
    value: function editAndGoAgain(hand) {
      return new _cincoEs5.Element('.gutter', {
        className: [hand + '-item']
      }).add(new _cincoEs5.Element('button.block.edit-and-go-again-toggle').text('Edit and go again'));
    }
  }, {
    key: 'compose',
    value: function compose() {
      return new _cincoEs5.Elements().add(new _cincoEs5.Element('header.promote-steps').add(new _cincoEs5.Element('h2').add(new _cincoEs5.Element('span.cursor').text('1'), new _cincoEs5.Element('span').text(' of '), new _cincoEs5.Element('span.limit').text('5')), new _cincoEs5.Element('h4').text('Evaluate each item below')), new _cincoEs5.Element('.items-side-by-side').add(
      // 1 column
      new _cincoEs5.Element('.split-hide-up').add(this.promoteImage('left'), this.promoteSubject('left'), this.promoteDescription('left'), this.promoteReference('left'), this.promoteSliders('left'), this.promoteFeedback('left'), this.promoteButton('left'), this.editAndGoAgain('left'), this.promoteImage('right'), this.promoteSubject('right'), this.promoteDescription('right'), this.promoteReference('right'), this.promoteSliders('right'), this.promoteFeedback('right'), this.promoteButton('right'), this.editAndGoAgain('right')),

      // 2 columns
      new _cincoEs5.Element('.split-hide-down').add(new _cincoEs5.Element('.row').add(new _cincoEs5.Element('.split-50.watch-100').add(this.promoteImage('left'), this.promoteSubject('left'), this.promoteDescription('left')), new _cincoEs5.Element('.split-50.watch-100').add(this.promoteImage('right'), this.promoteSubject('right'), this.promoteDescription('right'))), new _cincoEs5.Element('.row').add(new _cincoEs5.Element('.split-50.watch-100').add(this.promoteReference('left')), new _cincoEs5.Element('.split-50.watch-100').add(this.promoteReference('right'))), new _cincoEs5.Element('.row').add(new _cincoEs5.Element('.split-50.watch-100').add(this.promoteSliders('left'), this.promoteFeedback('left')), new _cincoEs5.Element('.split-50.watch-100').add(this.promoteSliders('right'), this.promoteFeedback('right'))), new _cincoEs5.Element('h4.text-center').text('Which of these is most important for the community to consider?'), new _cincoEs5.Element('.row').add(new _cincoEs5.Element('.split-50.watch-100').add(this.promoteButton('left')), new _cincoEs5.Element('.split-50.watch-100').add(this.promoteButton('right'))), new _cincoEs5.Element('.row').add(new _cincoEs5.Element('.split-50.watch-100').add(this.editAndGoAgain('left')), new _cincoEs5.Element('.split-50.watch-100').add(this.editAndGoAgain('right')))), new _cincoEs5.Element('button.finish.block').text('Neither')));
    }
  }]);

  return Promote;
})(_cincoEs5.Element);

exports['default'] = Promote;
module.exports = exports['default'];