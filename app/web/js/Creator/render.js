! function () {
  
  'use strict';

  var Upload    =   require('../Upload');
  var Form      =   require('../Form');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function render (cb) {
    
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
    
    form.send(creator.create.bind(creator));

    cb();
  }

  module.exports = render;

} ();
