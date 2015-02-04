! function () {
  
  'use strict';

  var Nav = require('./Nav');
  var Upload = require('./Upload');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Identity () {
    this.template = $('#identity');

    this.template.data('identity', this);
  }

  Identity.prototype.find = function (name) {
    switch ( name ) {
      case 'expand':
        return this.template.find('.profile-expand');

      case 'toggle arrow':
        return this.template.find('.toggle-arrow');

      case 'title':
        return this.template.find('.item-title');

      case 'description':
        return this.template.find('.description');

      case 'upload button':
        return this.template.find('.upload-identity-picture');

      case 'upload button pretty':
        return this.template.find('.upload-image');

      case 'first name':
        return this.template.find('[name="first-name"]');

      case 'middle name':
        return this.template.find('[name="middle-name"]');

      case 'last name':
        return this.template.find('[name="last-name"]');

      case 'image':
        return this.template.find('.item-media img');
    }
  };

  Identity.prototype.render = function () {

    var identity = this;

    this.find('expand').find('.is-section').append($('#identity-expand').clone());

    this.find('upload button pretty').on('click', function () {
      identity.find('upload button').click();
    });

    this.find('toggle arrow').find('i').on('click', function () {
      
      var arrow = $(this);

      Nav.toggle(identity.find('expand'), identity.template, function () {
        if ( identity.find('expand').hasClass('is-hidden') ) {
          arrow.removeClass('fa-arrow-up').addClass('fa-arrow-down');
        }
        else {
          arrow.removeClass('fa-arrow-down').addClass('fa-arrow-up');
        }
      });
    });

    this.find('title').text('Identity');

    this.find('description').text('This information is used to identify you and make sure that you are unique');

    this.template.find('.item-references').remove();

    this.template.find('.box-buttons').remove();

    this.find('image').attr('src', 'http://res.cloudinary.com/hscbexf6a/image/upload/v1422988238/rlvmd6e2yketthe66xmc.jpg');

    new Upload(null, this.find('upload button'), this.template.find('.item-media'),
      function (error, file) {
        var stream = ss.createStream();

        ss(app.socket).emit('upload image', stream,
          { size: file.size, name: file.name });
        
        ss.createBlobReadStream(file).pipe(stream);

        stream.on('end', function () {
          // new_item.image = file.name;
          app.socket.emit('save user image', synapp.user, file.name);

          app.socket.once('saved user image', function (user) {
            console.log('image saved', user);
          });
        });
      });

    // First name - save on change

    this.find('first name').on('change', this.saveName.bind(this));

    // Last name - save on change

    this.find('last name').on('change', this.saveName.bind(this));

    // Middle name - save on change

    this.find('middle name').on('change', this.saveName.bind(this));
  };

  /**
   *  @method saveName
   */

  Identity.prototype.saveName = function () {
    var name = {
      first_name: this.find('first name').val(),
      middle_name: this.find('middle name').val(),
      last_name: this.find('last name').val()
    };

    app.socket.emit('change user name', synapp.user, name);
  };

  Identity.prototype.renderUser = function () {

    // User image

    if ( this.user.image ) {
      this.find('image').attr('src', this.user.image);
    }

    // First name

    this.find('first name').val(this.user.first_name);

    // Middle name

    this.find('middle name').val(this.user.middle_name);

    // Last name

    this.find('last name').val(this.user.last_name);
  };

  module.exports = Identity;

} ();
