'use strict';

import Upload         from '../../../lib/util/upload';
import Form           from '../../../lib/util/form';
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

      // References

      this.renderReferences();

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
