'use strict';

import React from 'react';
import Component            from '../../lib/app/component';

class Modal extends React.Component {

  hide (e) {

    e.preventDefault();

    let modal = React.findDOMNode(this.refs.modal);

    modal.classList.remove('syn--visible');
  }

  render () {

    // return (
    //   <Base classes={ classes } { ...this.props }>
    //     <div className="syn-modal-flipper">
    //       <Base classes={ ["syn-modal-front"] }>

    //       </Base>
    //     </div>
    //   </Base>
    // );

    return (
      <section className={ Component.classList(this, 'syn-modal') } ref="modal">
        <div className="syn-modal-cover" onClick={ this.hide.bind(this) }></div>
        <div className="syn-modal-container">
          <header className="syn-modal-header">
            <h1>{ this.props.title }</h1>
          </header>

          <section>
            { this.props.children }
          </section>

          <footer>
            <a href="" onClick={ this.hide.bind(this) }>X CLOSE</a>
          </footer>

        </div>
      </section>
    );
  }
}

export default Modal;
