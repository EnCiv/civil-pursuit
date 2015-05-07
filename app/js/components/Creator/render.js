! function () {
  
  'use strict';

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Dependencies
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  var Promise             =   require('promise');

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Providers
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  var __Upload            =   require('syn/js/providers/Upload');
  var __Form              =   require('syn/js/providers/Form');
  var __YouTube           =   require('syn/js/providers/YouTube');
  var __Domain            =   require('syn/js/providers/Domain');

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  /** Render Creator
   *
   *  @function
   *  @return
   *  @arg            {Function} cb
  */
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function render (cb) {

    var comp = this;

    var q = new Promise(function (fulfill, reject) {

      new __Domain(function (d) {

        // Make sure template exists in DOM

        if ( ! comp.template.length ) {
          throw new Error('Creator not found in panel ' + comp.panel.getId());
        }

        // Attach component to template's data

        comp.template.data('creator', comp);

        // Emulate input type file's behavior with button

        comp.find('upload image button').on('click', function () {
          comp.find('dropbox').find('[type="file"]').click();
        });

        // Use upload service

        new __Upload(comp.find('dropbox'), comp.find('dropbox').find('input'), comp.find('dropbox'));

        // Autogrow

        comp.template.find('textarea').autogrow();

        // Get reference's title

        comp.find('reference').on('change', function () {

          var creator     =   $(this).closest('.creator').data('creator');

          var board       =   creator.find('reference board');
          var reference   =   $(this);

          board.removeClass('hide').text('Looking up title');

          app.socket.emit('get url title', $(this).val(),
            function (error, ref) {
              if ( ref.title ) {
                
                board.text(ref.title);
                reference.data('title', ref.title);

                var yt = __YouTube(ref.url);

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

        // Build form using Form provider

        var form = new __Form(comp.template);
        
        form.send(comp.create.bind(comp));

        // Done

        fulfill();

      }, reject);

    });
    
    if ( typeof cb === 'function' ) {
      q.then(cb.bind(null, null), cb);
    }

    return q;
    
  }

  module.exports = render;

} ();
