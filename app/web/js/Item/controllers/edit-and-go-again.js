! function () {

  'use strict';

  function editAndGoAgain (view, item) {

    var div = this;

    var Panel = div.root.extension('Panel');

    console.log('%c Rendering Edit and go again', 'font-weight:bold', item);

    var $item = view.find('.item');

    $item.find('[name="subject"]').val(item.subject);
    $item.find('[name="description"]').val(item.description);

    if ( item.references.length ) {
      $item.find('[name="reference"]').val(item.references[0].url);
    }

    $item.find('.item-media-wrapper')
      .empty()
      .append(
        this.controller('item media')(item));

    $item.find('.button-create').on('click', function () {

      var $editor      =   $(this).closest('.editor');

      // Subject field

      var $subject      =   $editor.find('[name="subject"]');

      // Description field

      var $description  =   $editor.find('[name="description"]');

      // Reference field
      
      var $reference    =   $editor.find('[name="reference"]');

      // Item

      var $item         =    $editor.closest('.item');

      // Panel

      var $panel        =    $editor.closest('.panel');

      // Reset errors in case of any from previous call

      $subject.removeClass('error');

      $description.removeClass('error');

      // Subject empty? Trigger visual error

      if ( ! $subject.val() ) {
        $subject.addClass('error').focus();
      }

      // Description empty? Trigger visual error

      else if ( ! $description.val() ) {
        $description.addClass('error').focus();
      }

      // No Errors? Proceed to back-end transmission

      else {
        var _item = item;

        _item.from          =   item._id;
        _item.subject       =   $subject.val();
        _item.description   =   $description.val();
        _item.references    =   [{
          url: $reference.val()
        }];

        delete _item._id;

        div.root.emitter('socket').emit('edit and go again', _item,
          div.domain.intercept(function (new_item) {
          
            console.log('//////////////', new_item)
            console.log('//////////////', new_item)
            console.log('//////////////', new_item)
            console.log('//////////////', new_item)
            console.log('//////////////', new_item)

            new_item.is_new = true;

            div.root.extension('Panel').controller('hide')(
              $editor, function () {
                div.push('items', new_item);
                luigi('tpl-item')
                  .controller(function ($item) {
                    $panel.find('.new-item:first').append($item);

                    Panel.controller('reveal')($panel.find('.new-item:first'),
                      $panel, function () {

                        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!', new_item._id);
                        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!', new_item._id);
                        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!', new_item._id);
                        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!', new_item._id);
                        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!', new_item._id);
                        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!', new_item._id);
                        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!', new_item._id);
                        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!', new_item._id);
                        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!', new_item._id);
                        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!', new_item._id);
                        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!', new_item._id);
                        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!', new_item._id);
                        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!', new_item._id);
                        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!', new_item._id);
                        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!', new_item._id);

                        $item.addClass('is-new');
                        
                        $item.attr('id', 'item-' + new_item._id);
                        
                        $item.insertAfter($panel.find('.new-item:first'));
                        
                        $panel.find('.new-item:first').empty().hide();
                        
                        div.controller('render')(new_item, div.domain.intercept());
                      });
                  })
                // div.controller('render')(item, div.domain.intercept());
              });
          



          }));
      }
    });

  };

  module.exports = editAndGoAgain;

} ();
