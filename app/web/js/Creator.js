/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  C   R   E   A   T   O   R

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function () {

  'use strict';

  var Form      =   require('./Form');
  var Nav       =   require('./Nav');
  var Panel     =   require('./Panel');
  var Item      =   require('./Item');
  var Upload    =   require('./Upload');
  var YouTube   =   require('./YouTube');

  var text      =   {
    'looking up title': 'Looking up'
  };

  /**
   *  @class
   *  @arg {Panel} - panel
   */

  function Creator (panel) {

    if ( ! app ) {
      throw new Error('Missing app');
    }

    if ( ! ( panel instanceof require('./Panel') ) ) {
      throw new Error('Creator: Panel must be a Panel object');
    }

    this.panel = panel;

    this.template = $('#' + this.panel.getId()).find('.creator:first');
  }

  Creator.prototype.find = function (name) {
    switch ( name ) {
      case 'create button':
        return this.template.find('.button-create:first');

      case 'form':
        return this.template.find('form');

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

      case 'upload image button':
        return this.template.find('.upload-image-button');
    }
  };

  Creator.prototype.render = function (cb) {
    if ( ! this.template.length ) {
      return cb(new Error('Creator not found in panel ' + this.panel.getId()));  
    }

    var creator = this;

    creator.template.data('creator', this);

    this.find('upload image button').on('click', function () {
      creator.find('dropbox').find('[type="file"]').click();
    });

    new Upload(creator.find('dropbox'), creator.find('dropbox').find('input'), creator.find('dropbox'));

    creator.template.find('textarea').autogrow();

    creator.find('reference').on('change', function () {

      var creator     =   $(this).closest('.creator').data('creator');

      var board       =   creator.find('reference board');
      var reference   =   $(this);

      board.removeClass('hide').text(text['looking up title']);

      app.socket.emit('get url title', $(this).val(),
        function (error, ref) {
          if ( ref.title ) {
            
            board.text(ref.title);
            reference.data('title', ref.title);

            var yt = YouTube(ref.url);

            if ( yt ) {
              creator.find('dropbox').hide();

              creator.find('item media')
                .empty()
                .append(yt);
            }
          }
          else {
            board.text('Looking up')
              .addClass('hide');
          }
        });
    });

    var form = new Form(creator.template);
    
    form.send(creator.save.bind(creator));

    cb();
  };

  /**
   *  @method save
   *  @return null
   */

  Creator.prototype.save = function () {

    // Self reference

    var creator = this;

    // Hide the Creator

    Nav.hide(creator.template, app.domain.intercept(function () {

      // Build the JSON object to save to MongoDB

      var new_item = creator.toItem();

      // Adding user from global synapp

      new_item.user = synapp.user;

      // In case a file was uploaded

      if ( new_item.upload ) {
        var file = creator.template.find('.preview-image').data('file');

        var stream = ss.createStream();

        ss(app.socket).emit('upload image', stream,
          { size: file.size, name: file.name });
        
        ss.createBlobReadStream(file).pipe(stream);

        stream.on('end', function () {
          new_item.image = file.name;

          app.socket.emit('create item', new_item);
        });
      }

      // If nof ile was uploaded

      else {
        console.log('create item', new_item);

        app.socket.emit('create item', new_item);
      }

      app.socket.once('could not create item', app.domain.intercept());

      app.socket.once('created item', function (item) {

        console.log('created item', item);

        creator.panel.template.find('.create-new').hide();

        if ( new_item.upload ) {
          item.upload = new_item.upload;
        }

        if ( new_item.youtube ) {
          item.youtube = new_item.youtube;
        }

        var item  = new Item(item);

        var items = creator.panel.find('items');

        item.get(app.domain.intercept(function () {
          items.prepend(item.template);
          item.render(app.domain.intercept(function () {
            item.find('toggle promote').click();
          }));
        }));
      });

    }));
  };

  Creator.prototype.toItem = function () {
    var item = {
      type:         this.panel.type,
      subject:      this.find('subject').val(),
      description:  this.find('description').val()
    };

    if ( this.panel.parent ) {
      item.parent = this.panel.parent;
    }

    if ( this.find('reference').val() ) {
      item.references = [{ url: this.find('reference').val() }];

      if ( this.find('reference board').text() && this.find('reference board').text() !== text['looking up title'] ) {
        item.references[0].title = this.find('reference board').text();
      }
    }


    if ( this.find('item media').find('img').length ) {

      if ( this.find('item media').find('.youtube-preview').length ) {
        item.youtube = this.find('item media').find('.youtube-preview').data('video');
      }

      else {
        item.upload = this.find('item media').find('img').attr('src');
        item.image = item.upload;
      }
    }
 
    return item;
  };

  module.exports = Creator;

} ();
