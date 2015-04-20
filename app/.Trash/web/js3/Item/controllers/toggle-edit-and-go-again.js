! function () {

  'use strict';

  function toggleEditAndGoAgain ($details, $item, item) {
    var app = this;

    var Panel = app.importer.extension('Panel');

    var $editor = $item.find('>.collapsers >.editor');

    $details
      .find('.edit-and-go-again-toggler')
      .eq(0)
      .on('click', function () {
        Panel.controller('reveal')($editor, $item);
      });
  }

  module.exports = toggleEditAndGoAgain;

} ();
