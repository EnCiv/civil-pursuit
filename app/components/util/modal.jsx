'use strict';

import React from 'react';
import Component from '../../lib/app/component';

class Modal extends React.Component {

  hide (e) {

    e.preventDefault();

    let modal = this.refs.modal;
    console.log("Modal.hide:", this.refs.modal);

    modal.classList.remove('syn--visible');
  }

  hvcenter(){
      let modalR=this.refs.modal.getBoundingClientRect();
      let container=this.refs.container;
      let containerR=container.getBoundingClientRect();
      let left=(modalR.width - containerR.width)/2; // center horizontally
      let top=(modalR.height - containerR.height)/2; // center vertically
      container.style.left=left + 'px'; 
      container.style.top=top + 'px';
  }

  componentDidMount(){
    this.hvcenter();
  }

  componentDidUpdate(){
    this.hvcenter();
  }

  render () {

    return (
      <section className={ Component.classList(this, 'syn-modal') } ref="modal" onClick={ this.hide.bind(this) }>
        <div className="syn-modal-container" ref='container'>
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
