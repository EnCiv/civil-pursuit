'use strict';

import CreatorView from '../creator/view';

class EditAndGoAgainView extends CreatorView {

  constructor () {
    super();

    this
      .removeClass('creator')
      // .removeClass('is-container')
      // .addClass('editor');
  }

}

export default EditAndGoAgainView;
