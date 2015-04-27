! function () {
  
  'use strict';

  var Elements =  require('./Elements');
  var Element =  require('./Element');

  /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   *  To HTML String
   *  --------------
   *
   *  @method
   *  @arg          {Element | [Element]} child
   *  @arg          {Mixed} locals
   *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */

  module.exports = function toHTML (child, locals, tab) {
    
    tab = tab || '';

    var lines = [];

    // Make sure we have an Element

    if ( typeof child === 'function' ) {
      child = child(locals);
    }

    if ( child instanceof Elements ) {
      child = child.elements;
    }

    if ( Array.isArray(child) ) {
      return
        child
          .map(function (elem) {
            return toHTML(elem, locals);
          })
          .join("\n");
    }

    if ( child instanceof Element === false ) {
      throw new Error('Not an element', child);
    }

    // Can we transform this Element?

    var cont = true;

    if ( typeof child.options.$condition === 'function' ) {
      cont = child.options.$condition(locals);
    }

    else if ( typeof child.options.$condition === 'boolean' ) {
      cont = child.options.$condition;
    }

    if ( ! cont ) {
      return '';
    }

    var resolved = Element.resolve(child.selector);

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

    var open = tab + '<' + element;

    var av;

    var classes;

    if ( typeof child.options === 'text' ) {
      child.options = { $text: child.options };
    }

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
    
    // lines.push(open);

    if ( ! child.options.$selfClosing ) {
      
      if ( child.options.$text ) {
        if ( typeof child.options.$text === 'string' ) {
          open += child.options.$text + '</' + element + '>';
        }

        else if ( typeof child.options.$text === 'function' ) {
          open += child.options.$text(locals) + '</' + element + '>';
        }

        lines.push(open);
      }

      else if ( ( Array.isArray(child.children) && child.children.length ) ||
        typeof child.children === 'function' ||
        children instanceof Elements ) {

        lines.push(open);

        var children = child.children;

        if ( typeof children === 'function' ) {
          children = children(locals);
        }

        if ( Array.isArray(children) ) {
          children = new Elements(children);
        }

        lines.push(children.toHTML(locals, tab + "  "));

        lines.push(tab + '</' + element + '>');
      }

      else {
        lines.push(open);

        lines.push(tab + '</' + element + '>');
      }
    }

    else {
      lines.push(open);
    }

    return lines.join("\n");
  };

} ();
