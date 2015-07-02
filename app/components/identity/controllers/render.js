! function () {
  
  'use strict';

  var Upload    =   require('syn/lib/util/upload');
  var Nav       =   require('syn/lib/util/nav');

  /**
   *  @method     Identity.render
   *  @return     null
   */

  function render () {
    
    var identity = this;

    /** input[type=file] is hidden for cosmetic reasons
          and is substituted visually by a button.
        This snippet binds clicking button with clicking the input[type=file]
    */

    this.find('upload button pretty').on('click', function () {
      identity.find('upload button').click();
    });

    /** Toggle arrow: expand/collapse identity */

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

    /** Write title */

    this.find('title').text('Identity');

    /** Write description */

    this.find('description').text('This information is used to identify you and make sure that you are unique');

    /** Remove references */

    this.template.find('.item-references').remove();

    /** Remove item buttons */

    this.template.find('.box-buttons').remove();

    /** Default user image */

    this.find('image').attr('src', 'http://res.cloudinary.com/hscbexf6a/image/upload/v1422988238/rlvmd6e2yketthe66xmc.jpg');

    new Upload(null, this.find('upload button'), this.template.find('.user-image-container'),
      function (error, file) {
        var stream = ss.createStream();

        ss(app.socket).emit('upload image', stream,
          { size: file.size, name: file.name });
        
        ss.createBlobReadStream(file).pipe(stream);

        stream.on('end', function () {
          // new_item.image = file.name;
          app.socket.emit('save user image',       
      
      
      
app.socket.synuser, file.name);

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

    // Set citizenships (2 selects)

    var citizenships = [
      $(this.find('citizenship')[0]).val(),
      $(this.find('citizenship')[1]).val()
    ];

    this.find('citizenship').each(function (index) {

      var select = $(this);

      select.on('change', function () {
        if ( select.val() ) {
          app.socket

            .on('citizenship set', function () {
              console.log('citizenship set', select.val(), index);
            })

            .emit('set citizenship',       
      
      
      
app.socket.synuser, select.val(), index);
        }
      });

    });

    // Set birthdate

    this.find('dob').on('change', function () {

      app.socket

        .on('birthdate set', function () {
          console.log('birthdate set');
        })

        .emit('set birthdate',       
      
      
      
app.socket.synuser, $(this).val());

    });

    // Set gender

    this.find('gender').on('change', function () {

      if ( $(this).val() ) {
        app.socket

          .on('gender set', function () {
            console.log('gender set');
          })

          .emit('set gender',       
      
      
      
app.socket.synuser, $(this).val());
      }

    });

  }

  module.exports = render;

} ();
