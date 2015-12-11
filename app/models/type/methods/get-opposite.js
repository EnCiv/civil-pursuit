'use strict';

function getOpposite () {
  return new Promise((ok, ko) => {
    console.log('get opposite', this._id);
    this.isHarmony().then(
      isHarmony => {
        if ( ! isHarmony ) {
          console.log('get opposite', this._id, 'is not hamrony');
          return ko(new Error('Get not get opposite of a type which is not part of an harmony'));
        }
        console.log('get opposite', this._id, 'is hamrony');
        this.findOne({ harmony : this._id }).then(
          parent => {
            if ( ! parent ) {
              return ko(new Error('Could not find parent of harmony'));
            }
            const opposite = parent.harmony
              .filter(_id => ! _id.equals(this._id))
              [0];
            console.log('opposite', this._id, opposite);
            this.findById(opposite).then(ok, ko);
          },
          ko
        );
      },
      ko
    );
  });
}

export default getOpposite;
