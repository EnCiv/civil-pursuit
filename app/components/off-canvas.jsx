'use strict';

import React from 'react';

class OffCanvas extends React.Component {

  static toggle () {
    const offCanvas = document.querySelector('#syn-off-canvas');
    const html = document.querySelector('html');

    offCanvas.classList.toggle('visible');
    html.classList.toggle('off');
  }

  render () {
    return (
      <section id="syn-off-canvas" ref="off-canvas">

      </section>
    );
  }
}

export default OffCanvas;
