'use strict';

import Upload from 'syn/lib/util/Upload';
import Form from 'syn/lib/util/Form';
import YouTube from 'syn/components/YouTube/Controller';
import domain from 'domain';

function renderCreator (cb) {
  var q = new Promise((fulfill, reject) => {

    let d = domain.create().on('error', reject);

    d.run(() => {
      // Make sure template exists in DOM

      if ( ! this.template.length ) {
        throw new Error('Creator not found in panel ' + this.panel.getId());
      }

      // Attach component to template's data

      this.template.data('creator', this);

      // Emulate input type file's behavior with button

      this.find('upload image button').on('click',  () => {
        this.find('dropbox').find('[type="file"]').click();
      });

      // Use upload service

      new Upload(this.find('dropbox'), this.find('dropbox').find('input'), this.find('dropbox'));

      // Autogrow

      this.template.find('textarea').autogrow();

      // Get reference's title

      this.find('reference').on('change', function () {

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

      var form = new Form(this.template);
      
      form.send(this.create);

      // Done

      fulfill();
    });
  });
    
  if ( typeof cb === 'function' ) {
    q.then(cb.bind(null, null), cb);
  }

  return q;
}

export default renderCreator;
