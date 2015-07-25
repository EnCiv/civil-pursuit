'use strict';

import YouTube from '../../youtube/ctrl';

function renderReferences (ref) {
  let self = this;

  // Get reference's title

  let findTitle = function () {

    let creator     =   $(this).closest('.' + ref).data(ref);

    let board       =   creator.find('reference board');
    let reference   =   $(this);
    let url         =   $(this).val();

    if ( ! /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(url) ) {

      if ( url ) {
        $(this).addClass('error');
      }

      return false;
    }

    $(this).removeClass('error');

    board.removeClass('hide').text('Looking up title');

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

  }

  this.find('reference')
    .on('blur change', findTitle)
    .on('keydown', function (e) {
      if ( e.keyCode === 9 || e.keyCode === 13 ) {
        findTitle.apply(this);
      }
    });
}

export default renderReferences;
