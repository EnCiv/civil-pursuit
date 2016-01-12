'use strict';

import Mungo            from 'mungo';
import should           from 'should';

function isObjectID(_id, compare = null, serialized = false) {
  return it => {

    if ( serialized ) {
      it('should be a string', () => {
        _id.should.be.a.String();
      });

      it('_id should be convertible to Object ID', () => {
        new (Mungo.ObjectID)(_id);
      });
    }
    else {
      it('_id should be an ObjectID', () => {
        try {
          _id.should.be.an.instanceof(Mungo.Type.ObjectID);
        }
        catch ( error ) {
          _id.should.be.an.instanceof(Mungo.mongodb.ObjectID);
        }
      });
    }

    if ( compare ) {
      it('_id should match compare', () => {
        _id.toString().should.be.exactly(compare.toString());
      });
    }

  };
}

export default isObjectID;
