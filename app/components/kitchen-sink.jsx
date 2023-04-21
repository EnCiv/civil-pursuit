'use strict';

import React            from 'react';
import Button           from './util/button';
import ButtonGroup      from './util/button-group';
import InputGroup       from './util/input-group';
import Modal            from './util/modal';
import Input        from './util/input';
import Select           from './util/select';

class KitchenSink extends React.Component {
  toggleModal () {
    let modal = React.findDOMNode(this.refs.modal);

    modal.classList.add('syn--visible');
  }

  render() {
    return (
      <section>
        <article>
          <hr />
          <h1>Typo</h1>
          <hr />

          <h1>This is a h1</h1>
          <h2>This is a h2</h2>
          <h3>This is a h3</h3>
          <h4>This is a h4</h4>
          <h5>This is a h5</h5>
        </article>

        <article>
          <hr />
          <h1>Buttons</h1>
          <hr />

          <Button>This is a button</Button>
          <Button shy>This is a shy button</Button>
          <Button info>This is a info button</Button>
          <Button primary>This is a primary button</Button>
          <Button success>This is a success button</Button>
          <Button error>This is a error button</Button>
          <Button warning>This is a warning button</Button>

          <p>
            <Button small>This is a small button</Button>
            <Button medium>This is a medium button</Button>
            <Button large>This is a large button</Button>
          </p>

          <p>
            <Button block>This is a block button</Button>
          </p>

          <hr />
          <h2>Buttons groups</h2>
          <hr />

          <p>
            <ButtonGroup>
              <Button primary>This is a primary button</Button>
              <Button success>This is a success button</Button>
              <Button error>This is a error button</Button>
            </ButtonGroup>
          </p>

          <p>
            <ButtonGroup block>
              <Button primary>This is a primary button</Button>
              <Button success>This is a success button</Button>
              <Button error>This is a error button</Button>
            </ButtonGroup>
          </p>

        </article>

        <article>
          <hr />
          <h1>Modals</h1>
          <hr />

          <Button primar onClick={ this.toggleModal.bind(this) }>Click to call modal</Button>

          <Modal title="Hey! I am a modal" ref="modal" />

        </article>

        <article>
          <hr />
          <h1>Inputs</h1>
          <hr />

          <Input placeholder='This is a text input' />
          <Input placeholder='This is a block text input' block />
          <Input placeholder='This is a small text input' block small />
          <Input placeholder='This is a medium text input' block medium />
          <Input placeholder='This is a large text input' block large />

          <p>
            <InputGroup>
              <Input placeholder='This is a text input' />
              <Input placeholder='This is a text input' />
              <Input placeholder='This is a text input' />
            </InputGroup>
          </p>

          <p>
            <InputGroup block>
              <Input placeholder='This is a text input' />
              <Input placeholder='This is a text input' />
              <Input placeholder='This is a text input' />
            </InputGroup>
          </p>

          <Select></Select>
          <Select small></Select>
          <Select medium></Select>
          <Select large></Select>

        </article>
      </section>
    );
  }
}

export default KitchenSink;
