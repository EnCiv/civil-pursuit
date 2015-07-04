'use strict';

import Upload         from 'syn/lib/util/upload';
import Form           from 'syn/lib/util/form';
import YouTube        from 'syn/components/youtube/ctrl';
import domain         from 'domain';

function renderCreator (cb) {
  var q = new Promise((fulfill, reject) => {

    let self = this;

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

      this.find('reference').on('blur change', function () {

        let creator     =   $(this).closest('.creator').data('creator');

        let board       =   creator.find('reference board');
        let reference   =   $(this);

        board.removeClass('hide').text('Looking up title');

        let url = $(this).val();

        if ( url ) {
          self.getTitle(url)
            .then(
              title => {
                if ( title ) {
                  board.text(title).on('click', function () {
                    reference.css('display', 'block');
                    board.addClass('hide');
                  });
                  reference.data('title', title).css('display', 'none');

                  let yt = YouTube(url);

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
              }
            );
        }

      });

      // Build form using Form provider

      var form = new Form(this.template);
      
      form.send(this.create.bind(this));

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
