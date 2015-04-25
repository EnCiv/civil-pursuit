! function () {
  
  'use strict';

  function Html5 () {
    this.children = [];

    for ( var i in arguments ) {
      this.children.push(arguments[i]);
    }
  }

  Html5.resolve = function (selector) {
    var element;
    var id;
    var classes = [];

    var trans = selector
      .replace(/\./g, '|.')
      .replace(/#/g, '|#');

    var bits = trans.split(/\|/);

    bits.forEach(function (bit) {

      if ( /^\./.test(bit) ) {
        classes.push(bit.replace(/^\./, ''));
      }

      else if ( /^#/.test(bit) ) {
        id = bit.replace(/^#/, '');
      }

      else if ( /^[A-Za-z-_\$]/.test(bit) ) {
        element = bit;
      }

    });

    return {
      selector  :   selector,
      element   :   element,
      classes   :   classes,
      id        :   id
    };
  };

  Html5.is = function (elem, selector) {

    var resolved = Html5.resolve(selector);

    var _resolved = Html5.resolve(elem.selector);

    var attempts = [];

    if ( resolved.element ) {
      attempts.push('element', _resolved.element === resolved.element);
    }

    if ( resolved.classes.length ) {
      attempts.push('classes', _resolved.classes.some(function (cl) {
        return resolved.classes.some(function (_cl) {
          return _cl === cl;
        });
      }));
    }

    if ( resolved.id ) {
      attempts.push('id',_resolved.id === resolved.id);
    }

    console.log('attempts', attempts)

    return attempts.every(function (attempt) {
      return attempt;
    });

  };

  Html5.elem = function (selector, options, children) {
    return {
      selector      :   selector,
      options       :   options || {},
      children      :   children || []
    }
  };

  Html5.elem.styleSheet = function (href) {
    return Html5.elem('link', {
      rel           :   'stylesheet',
      type          :   'text/css',
      href          :   href,
      $selfClosing  :   true
    });
  };

  Html5.elem.importScript = function (src) {
    return Html5.elem('script', {
      src           :   src,
    });
  };

  Html5.elem.toHTML = function (child, locals) {
    var l = [];

    var cont = true;

    if ( typeof child.options.$condition === 'function' ) {
      cont = child.options.$condition(locals);
    }

    else if ( typeof child.options.$condition === 'boolean' ) {
      cont = child.options.$condition;
    }

    if ( ! cont ) {
      return;
    }

    var resolved = Html5.resolve(child.selector);

    var element = resolved.element || 'div';

    child.options.className = (child.options.className || []);
    
    child.options.className = child.options.className
      .concat(resolved.classes.filter(function (cl) {
        return child.options.className.every(function (_cl) {
          return _cl !== cl;
        });
      }));

    if ( ! child.options.id && resolved.id ) {
      child.options.id = resolved.id;
    }

    var open = '<' + element;

    var av;

    var classes;

    for ( var attr in child.options ) {

      if ( attr === 'className' ) {
        if ( typeof child.options.className === 'string' ) {
          classes = child.options.className.split(/\s+/);
        }
        else {
          classes = child.options.className;
        }

        if ( classes.length ) {
          open += ' class="' + classes.join(' ') + '"';
        }
      }

      else if ( ! /^\$/.test(attr) ) {
      
        if ( typeof child.options[attr] === 'function' ) {
          av = child.options[attr](locals);
        }

        else {
          av = child.options[attr];
        }

        if ( av !== null && typeof av !== 'undefined' ) {
          open += ' ' + attr + '="' + av + '"';
        }
      }
      
    }

    if ( child.options.$selfClosing ) {
      open += '/'
    }

    open += '>';
    
    l.push(open);

    if ( ! child.options.$selfClosing ) {
      
      if ( child.options.$text ) {
        if ( typeof child.options.$text === 'string' ) {
          l.push(child.options.$text);
        }

        else if ( typeof child.options.$text === 'function' ) {
          l.push(child.options.$text(locals));
        }
      }

      else if ( child.children.length || typeof child.children === 'function' ) {

        var children = child.children;

        if ( typeof children === 'function' ) {
          children = children(locals);
        }

        l = l.concat(children.map(function (child) {
          return Html5.elem.toHTML(child, locals);
        }));
      }


      l.push('</' + element + '>');
    }

    return l.join("\n");
  };

  Html5.prototype.toHTML = function (locals) {
    var l = ['<!DOCTYPE html>'];

    l.push('<meta charset="utf-8" />');

    l = l.concat(this.children.map(function (child) {
      return Html5.elem.toHTML(child, locals);
    }));

    return l.join("\n");
  };

  Html5.prototype.elem = function () {
    // body...
  };

  module.exports = Html5;

} ();
