'use strict';

import React from 'react';

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
    return (
      <section id="syn-header-menu" ref="header-menu">
        <ul>
          <li>
            <a href="">
              <i className="fa fa-home"></i>
              <span> Home</span>
            </a>
          </li>

          <li>
            <a href="">
              <i className="fa fa-info"></i>
              <span> About</span>
            </a>
          </li>

          <li>
            <a href="">
              <i className="fa fa-life-ring"></i>
              <span> FAQ</span>
            </a>
          </li>

          <li>
            <a href="">
              <i className="fa fa-rss"></i>
              <span> Blog</span>
            </a>
          </li>

          <li>
            <a href="">
              <i className="fa fa-paper-plane-o"></i>
              <span> Contact</span>
            </a>
          </li>
        </ul>
      </section>
    );
  }
}

export default HeaderMenu;
