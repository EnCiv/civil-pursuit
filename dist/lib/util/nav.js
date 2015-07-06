/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  N   A   V

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

'use strict';

!(function () {

  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function toggle(elem, poa, cb) {
    if (!elem.hasClass('is-toggable')) {
      elem.addClass('is-toggable');
    }

    if (elem.hasClass('is-showing') || elem.hasClass('is-hiding')) {
      var error = new Error('Animation already in progress');
      error.code = 'ANIMATION_IN_PROGRESS';
      return cb(error);
    }

    if (elem.hasClass('is-shown')) {
      unreveal(elem, poa, cb);
    } else {
      reveal(elem, poa, cb);
    }
  }

  /**
   *  @function
   *  @return
   *  @arg
   */

  function reveal(elem, poa, cb) {
    var emitter = new (require('events').EventEmitter)();

    if (typeof cb !== 'function') {
      cb = console.log.bind(console);
    }

    emitter.revealed = function (fn) {
      emitter.on('success', fn);
      return this;
    };

    emitter.error = function (fn) {
      emitter.on('error', fn);
      return this;
    };

    setTimeout(function () {
      if (!elem.hasClass('is-toggable')) {
        elem.addClass('is-toggable');
      }

      console.log('%c reveal', 'font-weight: bold', elem.attr('id') ? '#' + elem.attr('id') + ' ' : '<no id>', elem.attr('class'));

      if (elem.hasClass('is-showing') || elem.hasClass('is-hiding')) {
        var error = new Error('Animation already in progress');
        error.code = 'ANIMATION_IN_PROGRESS';
        return cb(error);
      }

      elem.removeClass('is-hidden').addClass('is-showing');

      if (poa) {
        scroll(poa, function () {
          show(elem, function () {
            emitter.emit('success');
            cb();
          });
        });
      } else {
        show(elem, function () {
          emitter.emit('success');
          cb();
        });
      }
    });

    return emitter;
  }

  /**
   *  @function
   *  @return
   *  @arg
   */

  function unreveal(elem, poa, cb) {
    if (!elem.hasClass('is-toggable')) {
      elem.addClass('is-toggable');
    }

    console.log('%c unreveal', 'font-weight: bold', elem.attr('id') ? '#' + elem.attr('id') + ' ' : '', elem.attr('class'));

    if (elem.hasClass('is-showing') || elem.hasClass('is-hiding')) {
      var error = new Error('Animation already in progress');
      error.code = 'ANIMATION_IN_PROGRESS';
      return cb(error);
    }

    elem.removeClass('is-shown').addClass('is-hiding');

    if (poa) {
      scroll(poa, function () {
        hide(elem, cb);
      });
    } else {
      hide(elem, cb);
    }
  }

  /**
   *  @function scroll
   *  @description Scroll the page till the point of attention is at the top of the screen
   *  @return null
   *  @arg {function} pointOfAttention - jQuery List
   *  @arg {function} cb - Function to call once scroll is complete
   *  @arg {number} speed - A number of milliseconds to set animation duration
   */

  function scroll(pointOfAttention, cb, speed) {
    // console.log('%c scroll', 'font-weight: bold',
    //   (pointOfAttention.attr('id') ? '#' + pointOfAttention.attr('id') + ' ' : ''), pointOfAttention.attr('class'));

    var emitter = new (require('events').EventEmitter)();

    emitter.scrolled = function (fn) {
      emitter.on('success', fn);
      return this;
    };

    emitter.error = function (fn) {
      emitter.on('error', fn);
      return this;
    };

    emitter.then = function (fn, fn2) {
      emitter.on('success', fn);
      if (fn2) emitter.on('error', fn2);
      return this;
    };

    var poa = pointOfAttention.offset().top - 60;

    var current = $('body,html').scrollTop();

    if (typeof cb !== 'function') {
      cb = function () {};
    }

    if (current === poa || current > poa && current - poa < 50 || poa > current && poa - current < 50) {

      emitter.emit('success');

      return typeof cb === 'function' ? cb() : true;
    }

    $.when($('body,html').animate({ scrollTop: poa + 'px' }, 500, 'swing')).then(function () {

      emitter.emit('success');

      if (typeof cb === 'function') {
        cb();
      }
    });

    return emitter;
  }

  /**
   *  @function
   *  @return
   *  @arg
   */

  function show(elem, cb) {

    var emitter = new (require('events').EventEmitter)();

    emitter.shown = function (fn) {
      emitter.on('success', fn);
      return this;
    };

    emitter.error = function (fn) {
      emitter.on('error', fn);
      return this;
    };

    setTimeout(function () {

      console.log('%c show', 'font-weight: bold', elem.attr('id') ? '#' + elem.attr('id') + ' ' : '', elem.attr('class'));

      // if ANY element at all is in the process of being shown, then do nothing because it has the priority and is a blocker

      if (elem.hasClass('.is-showing') || elem.hasClass('.is-hiding')) {

        emitter.emit('error', new Error('Already in progress'));

        if (typeof cb === 'function') {
          cb(new Error('Show failed'));
        }

        return false;
      }

      // make sure margin-top is equal to height for smooth scrolling

      elem.css('margin-top', '-' + elem.height() + 'px');

      // animate is-section

      $.when(elem.find('.is-section:first').animate({
        marginTop: 0
      }, 500)).then(function () {
        elem.removeClass('is-showing').addClass('is-shown');

        if (elem.css('margin-top') !== 0) {
          elem.animate({ 'margin-top': 0 }, 250);
        }

        emitter.emit('success');

        if (cb) {
          cb();
        }
      });

      elem.animate({
        opacity: 1
      }, 500);
    });

    return emitter;
  }

  /**
   *  @function
   *  @return
   *  @arg
   */

  function hide(elem, cb) {
    var emitter = new (require('events').EventEmitter)();

    emitter.hiding = function (cb) {
      this.on('hiding', cb);
      return this;
    };

    emitter.hidden = function (cb) {
      this.on('hidden', cb);
      return this;
    };

    emitter.error = function (cb) {
      this.on('error', cb);
      return this;
    };

    process.nextTick(function () {

      var domain = require('domain').create();

      domain.on('error', function (error) {
        emitter.emit('error', error);
      });

      domain.run(function () {

        if (!elem.length) {
          return cb();
        }

        // if ANY element at all is in the process of being shown, then do nothing because it has the priority and is a blocker

        if (elem.hasClass('.is-showing') || elem.hasClass('.is-hiding')) {
          emitter.emit('bounced');
          return false;
        }

        emitter.emit('hiding');

        console.log('%c hide', 'font-weight: bold', elem.attr('id') ? '#' + elem.attr('id') + ' ' : '', elem.attr('class'));

        elem.removeClass('is-shown').addClass('is-hiding');;

        elem.find('.is-section:first').animate({
          'margin-top': '-' + elem.height() + 'px' }, 1000, function () {
          elem.removeClass('is-hiding').addClass('is-hidden');

          emitter.emit('hidden');

          if (cb) cb();
        });

        elem.animate({
          opacity: 0
        }, 1000);
      });
    });

    return emitter;
  }

  module.exports = {
    toggle: toggle,
    reveal: reveal,
    unreveal: unreveal,
    show: show,
    hide: hide,
    scroll: scroll
  };
})();

// 'padding-top': elem.height() + 'px'