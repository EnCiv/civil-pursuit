'use strict';

import React            from 'react';
import Uploader         from './uploader';
import TextInput        from './util/text-input';
import TextArea         from './util/text-area';
import Submit           from './util/submit';
import Icon             from './util/icon';
import Form             from './util/form';

class Creator extends React.Component {

  componentDidMount () {
    let subject       =   React.findDOMNode(this.refs.subject);
    let reference     =   React.findDOMNode(this.refs.reference);
    let description   =   React.findDOMNode(this.refs.description);
    let media         =   React.findDOMNode(this.refs.media);
    let creator       =   React.findDOMNode(this.refs.creator);

    let mediaHeight = media.offsetHeight;
    let inputHeight = subject.offsetHeight + reference.offsetHeight;

    description.style.height = ( mediaHeight - inputHeight ) + 'px';
  }

  render () {
    return (
      <Form>
        <article className="item" ref="creator">
          <section className="item-media-wrapper">
            <section className="item-media">
              <Uploader ref="media" />
            </section>
          </section>

          <section className="item-buttons">
            <Submit radius>
              <Icon icon="bullhorn" />
            </Submit>
          </section>

          <section className="item-text">
            <div className="item-inputs">
              <TextInput block placeholder="Subject" ref="subject" required />
              <TextInput block placeholder="http://" ref="reference" />
              <TextArea block placeholder="Description" ref="description" required></TextArea>
            </div>
          </section>


          <section style={ { clear : 'both' }}></section>
        </article>
      </Form>
    );
  }
}

export default Creator;
