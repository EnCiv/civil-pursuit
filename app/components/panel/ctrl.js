'use strict';

import Controller   from 'syn/lib/app/controller';
import Nav          from 'syn/lib/util/nav';
import Creator      from 'syn/components/creator/ctrl';
import Item         from 'syn/components/item/ctrl';
import TopBar       from 'syn/components/top-bar/ctrl';
import View         from 'syn/components/panel/view';
import cache        from 'syn/lib/app/cache';

class Panel extends Controller {

  constructor (props) {
    super();

    this.props = props;

    this.componentName = 'Panel';
    this.view = View;

    if ( this.props.panel ) {
      this.set('panel', this.props.panel);
      this.panel = this.props.panel;
    }

    if ( this.props.panel ) {
      this.type     =   this.props.panel.type;
      this.parent   =   this.props.panel.parent;
      this.skip     =   this.props.panel.skip || 0;
      this.size     =   this.props.panel.size || synapp.config['navigator batch size'];
      this.id       =   Panel.getId(this.props.panel);
    }
  }

  find (name) {
    switch ( name ) {
      case 'title':
        return this.template.find('.panel-title:first');

      case 'toggle creator':
        return this.template.find('.toggle-creator:first');

      case 'creator':
        return this.template.find('.creator:first');

      case 'items':
        return this.template.find('.items:first');

      case 'load more':
        return this.template.find('.load-more:first');

      case 'create new':
        return this.template.find('.create-new:first');
    }
  }

  render (cb) {
    var q = new Promise((fulfill, reject) => {

      let d = this.domain;

      d.run(() => {

        let panel = this.panel;

        // Fill title                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        this.find('title').text(panel.type.name);

        // Toggle Creator

        this.find('toggle creator').on('click', () => {
          console.log('clicked', this.socket.synuser)
          if ( this.socket.synuser ) {
            Nav.toggle(this.find('creator'), this.template, d.intercept());
          }
          else {
            let topbar = new TopBar();
            topbar.find('join button').click();
          }
        });

        // Panel ID

        if ( ! this.template.attr('id') ) {
          this.template.attr('id', this.id);
        }

        var creator = new Creator(this.props, this);

        creator
          .render()
          .then(fulfill, d.intercept.bind(d));

        this.find('load more').on('click', () => {
          this.fill();
          return false;
        });

        this.find('create new').on('click', () => {
          this.find('toggle creator').click();
          return false;
        });

        // Done

        fulfill();

      }, reject);

    });

    if ( typeof cb === 'function' ) {
      q.then(cb.bind(null, null), cb);
    }

    return q;
  }

  fill (item, cb) {
    if ( typeof item === 'function' && ! cb ) {
      cb = item;
      item = undefined;
    }

    let panel = this.toJSON();

    if ( item ) {
      panel.item = item;
      panel.type = undefined;
    }

    this
      .publish('get items', panel)
      .subscribe((pubsub, _panel, items) => {
        if ( Panel.getId(panel) !== Panel.getId(_panel) ) {
          return /** This is about another panel */;
        }

        pubsub.unsubscribe();

        console.log('got panel items', items);

        this.template.find('.hide.pre').removeClass('hide');
        this.template.find('.show.pre').removeClass('show').hide();

        this.template.find('.loading-items').hide();

        if ( items.length ) {

          this.find('create new').hide();
          this.find('load more').show();

          if ( items.length < synapp.config['navigator batch size'] ) {
            this.find('load more').hide();
          }

          this.skip += items.length;

          this.preInsertItem(items, cb);
        }

        else {
          this.find('create new').show();
          this.find('load more').hide();
        }
      });
  }

  toJSON () {
    var json = {
      type: this.type,
      size: this.size,
      skip: this.skip,
      // item: app.location.item
    };

    if ( this.parent ) {
      json.parent = this.parent;
    }

    return json;
  }

  preInsertItem (items, cb) {

    let d = this.domain;

    /** Load template */

    // if ( ! cache.getTemplate('Item') ) {
      new Item().load();
      // return this.preInsertItem(items, cb);
    // }

    /** Items to object */

    items = items.map(item => {
      let props = {};

      for ( let i in this.props ) {
        props[i] = this.props;
      }

      props.item = item;

      let itemComponent = new Item(props);

      itemComponent.load();

      this.find('items').append(itemComponent.template);

      return itemComponent;
    });

    var i = 0;
    var len = items.length;

    function next () {
      i ++;

      if ( i === len && cb ) {
        cb();
      }
    }

    items.forEach(item => item.render(d.intercept(next)));
  }

}

Panel.getId = function (panel) {
  let id = 'panel-' + (panel.type._id || panel.type);

  if ( panel.parent ) {
    id += '-' + panel.parent;
  }

  return id;
};

export default Panel;
