'use strict'

import {Element} from 'cinco/es5';
import Layout from 'syn/components/Layout/View';
import YouTube from 'syn/components/YouTube/View';

class ComponentPage extends Layout {
  constructor(props) {
    super(props);
    this.props = props;

    this.component = this.props.component;

    var main = this.find('#main').get(0);

    main.add(
      this.components()
    );
  }

  components () {

    let componentsList = this.props.components.map(component =>
      new Element('option')
        .text(component)
        .attr('selected', () => component === this.props.component.name)
    );

    let props = this.props;

    if ( this.props.payload ) {
      for ( var i in this.props.payload ) {
        if ( i !== 'item' ) {
          props[i] = this.props.payload[i];
        }
      }
    }

    return new Element('section#components').add(
      new Element('header').add(
        new Element('h1').text('Components'),
        new Element('h2').text(this.component.name)
      ),

      new Element('form', {
        method  : 'POST',
        style   : 'background: #ccc'
      })
        .add(
          new Element('').add(
            new Element('select')
              .attr('onChange', () => "location.href='/component/'+this.value")
              .add(...componentsList)
          ),

          new Element('').add(
            new Element('label').text('Env'),
            new Element('input', { type: 'text', name: 'env' })
          ),

          new Element('').add(
            new Element('label').text('Item'),
            new Element('input', { type: 'text', name: 'item',
              value: () => {
                if ( this.props.payload ) {
                  return this.props.payload.item || '';
                }
                return '';
              }})
          ),

          new Element('input', {
            type : 'submit',
            value : 'Submit'
          })
        ),

      new Element('.component-preview')

        .attr('style', () => 'border: 5px solid black')

        .add(
          new (this.component)(props)
        ),

      new Element('pre').text(JSON.stringify(props, null, 2))
    );
  }
}

export default ComponentPage;
