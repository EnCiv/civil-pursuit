'use strict';

class Component {
  static classList (component, ...classes) {
    let classList = [];

    if ( component.props.className ) {
      component.props.className.split(/\s+/).forEach(cls => classList.push(cls));
    }

    classList.push(...classes);

    for ( let key in component.props ) {
      if ( /^syn-/.test(key) && component.props[key] ) {
        classList.push(key);
      }
    }

    const props = ['text-right', 'text-center', 'text-left', 'gutter'];

    for ( let prop of props ) {
      if ( component.props[prop] ) {
        classList.push(prop);
      }
    }

    if ( component.props.screen ) {
      classList.push(`syn-screen-${component.props.screen.replace(/-/g, '_')}`);
    }

    return classList.join(' ');
  }
}

export default Component;
