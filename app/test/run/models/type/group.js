'use strict';

import describe               from 'redtea';
import should                 from 'should';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import Type                   from 'syn/../../dist/models/type';
import isType                 from 'syn/../../dist/test/is/type';

function testTypeGroup (props) {

  const locals = {};

  return testWrapper(
    'Type Model : Group',
    {
      mongodb : true
    },

    wrappers => it => {

      it('should create a group',
        () => Type
          .group(
            'test-type-group-parent',
            'test-type-group-subtype',
            'test-type-group-pro',
            'test-type-group-con'
          )
          .then(group => { locals.group = group })
      );

      it('Group', it => {

        it('should be an object',
          () => locals.group.should.be.an.Object()
        );

        it('Parent', it => {
          it('should have a parent',
            () => locals.group.should.have.property('parent')
          );

          it('should be a type',
            describe.use(() => isType(locals.group.parent, {
              name : 'test-type-group-parent'
            }))
          );

          it('Harmony', it => {
            it('should have harmony',
              () => locals.group.parent.should.have.property('harmony')
            );

            it('harmony 1 should be pro',
              () => locals.group.parent.harmony[0]
                .equals(locals.group.pro._id)
                .should.be.true()
            );

            it('harmony 2 should be con',
              () => locals.group.parent.harmony[1]
                .equals(locals.group.con._id)
                .should.be.true()
            );
          });
        });

        it('Subtype', it => {
          it('should have a subtype',
            () => locals.group.should.have.property('subtype')
          );

          it('should be a type',
            describe.use(() => isType(locals.group.subtype, {
              name : 'test-type-group-subtype'
            }))
          );

          it('Parent', it => {
            it('should have parent',
              () => locals.group.subtype.should.have.property('parent')
            );

            it('parent should be correct',
              () => locals.group.subtype.parent
                .equals(locals.group.parent._id)
                .should.be.true()
            );
          });
        });

        it('Pro', it => {
          it('should have a pro',
            () => locals.group.should.have.property('pro')
          );

          it('should be a type',
            describe.use(() => isType(locals.group.pro, {
              name : 'test-type-group-pro'
            }))
          );
        });

        it('Con', it => {
          it('should have a con',
            () => locals.group.should.have.property('con')
          );

          it('should be a type',
            describe.use(() => isType(locals.group.con, {
              name : 'test-type-group-con'
            }))
          );
        });

      });

    }
  );
}

export default testTypeGroup;
