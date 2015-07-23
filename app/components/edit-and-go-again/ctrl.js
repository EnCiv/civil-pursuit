'use strict';

import Controller       from  '../../lib/app/controller';
import Nav              from  '../../lib/util/nav';
import Form             from  '../../lib/util/form';
import View             from './view';

class EditAndGoAgainCtrl extends Controller {

  constructor (props) {
    super();

    this.item = props.item;
  }

  load () {
    this.template = $(new View().render());
  }

  find () {
    switch ( name ) {
      case 'create button':
        return this.template.find('.button-create:first');

      case 'dropbox':
        return this.template.find('.drop-box');

      case 'subject':
        return this.template.find('[name="subject"]');

      case 'description':
        return this.template.find('[name="description"]');

      case 'item media':
        return this.template.find('.item-media');

      case 'reference':
        return this.template.find('.reference');

      case 'reference board':
        return this.template.find('.reference-board');
    }
  }

  render () {
    this.template.find('[name="subject"]').val(this.item.get('item').subject);

    this.template.find('[name="description"]')
      .val(this.item.get('item').description)
      .autogrow();

    if ( this.item.get('item').references.length ) {
      this.template.find('[name="reference"]')
        .val(this.item.get('item').references[0].url);
    }

    this.template.find('.item-media')
      .empty()
      .append(this.item.media());

    let form = new Form(this.template);

    form.send(this.save.bind(this));
  }

  save () {
    Nav.hide(this.template, this.domain.intercept(() => {
      Nav.hide(this.template.closest('.edit-and-go-again'), this.domain.intercept(() => {
        
        let newItem = this.toItem();

        this
          .publish('create item', newItem)
          .subscribe((pubsub, item) => {
            console.warn('NEW ITEM', item);
            pubsub.unsubscribe();
          });

        // app.socket.emit('create item', new_item);

        // app.socket.once('could not create item', function (error) {
        //   console.error(error)
        // });
        
        // app.socket.once('created item', function (item) {
        //   console.log('created item', item);

        //     if ( new_item.upload ) {
        //       item.upload = new_item.upload;
        //     }

        //     if ( new_item.youtube ) {
        //       item.youtube = new_item.youtube;
        //     }

        //     var item  = new (require('../../../components/item/ctrl'))(item);

        //     item.load(app.domain.intercept(function () {
        //       item.template.insertBefore(edit.item.template);
              
        //       item.render(app.domain.intercept(function () {
        //         item.find('toggle promote').click();
        //       }));
        //     }));
        // });
      }));
    }));
  }

  toItem () {
    var item = {
      from          :     this.item.get('item')._id,
      subject       :     this.template.find('[name="subject"]').val(), /* 2 */
      description   :     this.template.find('[name="description"]').val(),
      user          :     this.socket.synuser,
      type          :     this.item.get('item').type
    };

    if ( this.template.find('.item-media').find('img').length ) {

      if ( this.template.find('.item-media').find('.youtube-preview').length ) {
        item.youtube = this.template.find('.item-media').find('.youtube-preview').data('video');
      }

      else {
        item.upload = this.template.find('.item-media').find('img').attr('src');
      }
    }
 
    return item;
  }

}

export default EditAndGoAgainCtrl;


// function Component_EditAndGoAgain_Controller () {

//   'use strict';

//   var Nav       =   require('../../lib/util/nav');
//   var Creator   =   require('../../components/creator//ctrl');
//   var Item      =   require('../../components/item/ctrl');
//   var Form      =   require('../../lib/util/form');

//   /**
//    *  @class
//    *
//    *  @arg {String} type
//    *  @arg {String?} parent
//    */

//   function Edit (item) {

//     console.log('EDIT', item)

//     if ( ! app ) {
//       throw new Error('Missing app');
//     }

//     var self = this;

//     app.domain.run(function () {
//       if ( ! item || ( ! item instanceof require('../../components/item/ctrl') ) ) {
//         throw new Error('Item must be an Item');
//       }

//       self.item = item;
//     });
//   }

//   Edit.prototype.get = function (cb) {
//     var edit = this;

//     $.ajax({
//       url: '/partial/creator'
//     })

//       .error(cb)

//       .success(function (data) {
//         edit.template = $(data);

//         cb(null, edit.template);
//       });

//     return this;
//   };

//   Edit.prototype.find = function (name) {
//     switch ( name ) {
//       case 'create button':
//         return this.template.find('.button-create:first');

//       case 'dropbox':
//         return this.template.find('.drop-box');

//       case 'subject':
//         return this.template.find('[name="subject"]');

//       case 'description':
//         return this.template.find('[name="description"]');

//       case 'item media':
//         return this.template.find('.item-media');

//       case 'reference':
//         return this.template.find('.reference');

//       case 'reference board':
//         return this.template.find('.reference-board');
//     }
//   };

//   Edit.prototype.render = function (cb) {

//     var edit = this;

//     // this.template.find('textarea').autogrow();

//     this.template.find('[name="subject"]').val(edit.item.item.subject);
//     this.template.find('[name="description"]')
//       .val(edit.item.item.description)
//       .autogrow();

//     if ( edit.item.item.references.length ) {
//       this.template.find('[name="reference"]').val(edit.item.item.references[0].url);
//     }

//     this.template.find('.item-media')
//       .empty()
//       .append(edit.item.media());

//     var form = new Form(this.template);

//     form.send(edit.save);

//     return this;
//   };

//   Edit.prototype.save = require('../../components/edit-and-go-again/controllers/save');

//   Edit.prototype.toItem = function () {
//     var item = {
//       from:         this.item.item._id,
//       subject:      this.find('subject').val(),
//       description:  this.find('description').val(),
//       user:         app.socket.synuser,
//       type:         this.item.item.type
//     };

//     if ( this.find('item media').find('img').length ) {

//       if ( this.find('item media').find('.youtube-preview').length ) {
//         item.youtube = this.find('item media').find('.youtube-preview').data('video');
//       }

//       else {
//         item.upload = this.find('item media').find('img').attr('src');
//       }
//     }
 
//     return item;
//   };

//   module.exports = Edit;

// }
