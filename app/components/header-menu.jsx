'use strict';

import React from 'react';
import menus from 'syn/../../fixtures/header-menu/1.json';
import Icon from 'syn/../../dist/components/util/icon';

class HeaderMenu extends React.Component {

  static toggle () {
    return new Promise((ok, ko) => {
      const headerMenu = document.querySelector('#syn-header-menu');

      headerMenu.classList.toggle('visible');

      if ( headerMenu.classList.contains('visible') ) {
        const headerHeight = headerMenu.offsetHeight;

        const bottom = `calc(100vh - ${(78 + headerHeight)}px)`;

        console.log({ bottom });

        headerMenu.style.bottom = bottom;
      }

      else {
        headerMenu.style.bottom = 'calc(100vh - 73px)';
      }

      setTimeout(ok);
    });
  }

  render () {
    const menusViews = menus.map((menu, index) => (
      <li key={ `header-menu-${index}` }>
        <a href={ menu.link }>
          <Icon icon={ menu.icon } />
          <span> { menu.title }</span>
        </a>
      </li>
    ));

    return (
      <section id="syn-header-menu" ref="header-menu">
        <ul>
          { menusViews }
        </ul>
      </section>
    );
  }
}

export default HeaderMenu;
