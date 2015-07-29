'use strict';

import UserModel from '../models/user';

function setParty (event, partyId) {
  try {
    UserModel
      .setParty(this.synuser.id, partyId)
      .then(
        user => this.ok(event, user),
        error => this.error(error)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default setParty;
