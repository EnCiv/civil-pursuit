'use strict';

import {Element} from 'cinco/dist';

class Item extends Element {

  constructor (props, extra) {
    super('.item');

    this.attr('id', props.item ? 'item-' + props.item.id  : '');

    this.props = props || {};

    this.extra = extra || {};

    this.add(
      this.media(),
      this.buttons(),
      this.text(),
      // this.arrow(),
      this.collapsers(),
      new Element('.clear')
    );
  }

  media () {
    return new Element('.item-media-wrapper').add(
      new Element('.item-media').add(
        () => {
          if ( this.props.item )             {
            if ( this.props.item.media )     {
              return this.props.item.media;
            }

            else if ( this.props.item.image ){
              return new Element('img.img-responsive', {
                src               :   this.props.item.image });
            }
          }

          return [];
        }
      )
    );
  }

  buttons () {
    let itemButtons = new Element('.item-buttons')
      .condition(() => {
        if ( 'buttons' in this.props ) {
          return this.props.buttons  !== false
        }
        return true;
      });

    if ( this.props.item && this.props.item.buttons ) {
      itemButtons.add(this.props.item.buttons);
    }

    else {
      itemButtons.add(new DefaultButtonsView(this.props));
    }

    return itemButtons;
  }

  subject () {
    return new Element('h4.item-subject.header').add(
      new Element('a', {
        href: locals => {
          if ( locals && locals.item )    {
            return Page('Item Page', locals && locals.item);
          }
          return '#';
        }
      })
        .text(() => {
          if ( this.props.item )  {
            return this.props.item.subject;
          }
          return '';
        })
    );
  }

  description () {
    return new Element('.item-description.pre-text')
      .text( () => {
        if ( this.props.item )      {
          return this.props.item.description;
        }
        return  '';
      })
  }

  references () {
    return new Element('h5.item-reference').add(
      new Element('a', {
        href    :   '#',
        target  :   '_blank',
        rel     :   'nofollow'
      }).text('reference')
    );
  }

  text () {
    return new Element('.item-text').add(
      new Element('.item-truncatable').add(
        this.subject(),
        this.references(),
        this.description()
      ),
      new Element('.clear.clear-text')
    );
  }

  collapsers () {

    return new Element('.item-collapsers')
      .condition(() => this.props.collapsers !== false)
      .add(
        this.promote(),
        this.details(),
        this.editAndGoAgain(),
        this.below()
      );
  }

  promote () {
    return new Element('.promote.is-container').add(
      new Element('.is-section').add(
        new Promote(this.props)
      )
    )
  }

  below () {
    // return new Element('.children.is-container').add(
    //   new Element('.is-section')
    // );

    return new Element('.children');
  }

  details () {
    return new Element('.details.is-container').add(
      new Element('.is-section').add(
        new Details(this.props)
      )
    )
  }

  editAndGoAgain () {
    return new Element('.edit-and-go-again.is-container').add(
      new Element('.is-section')
    );
  }

  arrow () {
    return new Element('.item-arrow')

      .condition( () => {
        if ( this.props.item ) {
          return this.props.item.collapsers !==   false;
        }
        return true;
      })

      .add(
        new Element('div').add(
          new Element('i.fa.fa-arrow-down')
        )
      );
  }

}

export default Item;

import Page                   from '../../lib/app/page';
import DefaultButtonsView     from '../item-default-buttons/view';
import Promote                from '../promote/view';
import Details                from '../details/view';
