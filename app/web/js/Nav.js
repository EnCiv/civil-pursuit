/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  NAV

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function () {

  'use strict';

  function toggle (elem, poa, cb) {
    if ( ! elem.hasClass('is-toggable') ) {
      elem.addClass('is-toggable');
    }

    if ( elem.hasClass('is-showing') || elem.hasClass('is-hiding') ) {
      var error = new Error('Animation already in progress');
      error.code = 'ANIMATION_IN_PROGRESS';
      return cb(error);
    }

    if ( elem.hasClass('is-shown') ) {
      unreveal(elem, poa, cb);
    }
    else {
      reveal(elem, poa, cb);
    }
  }

  function reveal (elem, poa, cb) {
    if ( ! elem.hasClass('is-toggable') ) {
      elem.addClass('is-toggable');
    }

    console.log('%c reveal', 'font-weight: bold',
      (elem.attr('id') ? '#' + elem.attr('id') + ' ' : '<no id>'), elem.attr('class'));

    if ( elem.hasClass('is-showing') || elem.hasClass('is-hiding') ) {
      var error = new Error('Animation already in progress');
      error.code = 'ANIMATION_IN_PROGRESS';
      return cb(error);
    }

    elem.removeClass('is-hidden').addClass('is-showing');

    if ( poa ) {
      scroll(poa, function () {
        show(elem, cb);
      });
    }

    else {
      show(elem, cb);
    }
  }

  function unreveal (elem, poa, cb) {
    if ( ! elem.hasClass('is-toggable') ) {
      elem.addClass('is-toggable');
    }

    console.log('%c unreveal', 'font-weight: bold',
      (elem.attr('id') ? '#' + elem.attr('id') + ' ' : ''), elem.attr('class'));

    if ( elem.hasClass('is-showing') || elem.hasClass('is-hiding') ) {
      var error = new Error('Animation already in progress');
      error.code = 'ANIMATION_IN_PROGRESS';
      return cb(error);
    }

    elem.removeClass('is-shown').addClass('is-hiding');

    if ( poa ) {
      scroll(poa, function () {
        hide(elem, cb);
      });
    }

    else {
      hide(elem, cb);
    }
  }

  function scroll (pointOfAttention, cb, speed) {
    console.log('%c scroll', 'font-weight: bold',
      (pointOfAttention.attr('id') ? '#' + pointOfAttention.attr('id') + ' ' : ''), pointOfAttention.attr('class'));

    var poa = (pointOfAttention.offset().top - 80);

    var current = $('body,html').scrollTop();

    if ( typeof cb !== 'function' ) {
      cb = function () {};
    }

    if ( 
      (current === poa) || 
      (current > poa && (current - poa < 50)) ||
      (poa > current && (poa - current < 50)) ) {

      return typeof cb === 'function' ? cb() : true;
    }

    $.when($('body,html')
      .animate({
        scrollTop: poa + 'px'
      }, 500, 'swing'))
      .then(cb);
  }

  function show (elem, cb) {
    if ( typeof cb !== 'function' ) {
      cb = function () {};
    }

    console.log('%c show', 'font-weight: bold',
      (elem.attr('id') ? '#' + elem.attr('id') + ' ' : ''), elem.attr('class'));

    // if ANY element at all is in the process of being shown, then do nothing because it has the priority and is a blocker
    
    if ( elem.hasClass('.is-showing') || elem.hasClass('.is-hiding') ) {
      cb(new Error('Show failed'));
      return false;
    }

    // make sure margin-top is equal to height for smooth scrolling

    elem.css('margin-top', '-' + elem.height() + 'px');

    // animate is-section

    $.when(elem.find('.is-section:first')
      .animate({
        marginTop: 0
      }, 500))
    .then(function () {
      elem.removeClass('is-showing').addClass('is-shown');
        
      if ( elem.css('margin-top') !== 0 ) {
        elem.animate({'margin-top': 0}, 250);
      }
      
      if ( cb ) {
        cb();
      }      
    });

    elem.animate({
       opacity: 1
      }, 500);
  }

  function hide (elem, cb) {
    // if ANY element at all is in the process of being shown, then do nothing because it has the priority and is a blocker

    if ( elem.hasClass('.is-showing') || elem.hasClass('.is-hiding') ) {
      return false;
    }

    console.log('%c hide', 'font-weight: bold',
      (elem.attr('id') ? '#' + elem.attr('id') + ' ' : ''), elem.attr('class'));

    elem.removeClass('is-shown').addClass('is-hiding');;

    elem.find('.is-section:first').animate(
      {
        'margin-top': '-' + elem.height() + 'px',
        // 'padding-top': elem.height() + 'px'
      },

      1000,

      function () {
        elem.removeClass('is-hiding').addClass('is-hidden');

        if ( cb ) cb();
      });

    elem.animate({
       opacity: 0
      }, 1000);
  }

  module.exports = {
    toggle:       toggle,
    reveal:       reveal,
    unreveal:     unreveal,
    show:         show,
    hide:         hide,
    scroll:       scroll
  };

} ();
