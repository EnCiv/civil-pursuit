'use striict';

import path     from 'path';
import fs       from 'fs';

const ROOT      =   path.resolve(__dirname, '../../..');
const APP       =   path.join(ROOT, 'app');
const DIST      =   path.join(ROOT, 'dist');
const PACKAGE   =   path.join(ROOT, 'package.json');
const CONFIG    =   path.join(ROOT, 'config.json');
const TARGET    =   path.join(ROOT, 'node_modules/syn');

class SymLink {
  static create () {
    return new Promise((ok, ko) => {
      SymLink
        .link(DIST, TARGET)
        .then(
          () => {
            SymLink
              .link(PACKAGE, path.join(TARGET, 'package.json'))
              .then(
                () => {
                  SymLink
                    .link(CONFIG, path.join(TARGET, 'config.json'))
                    .then(ok, ko);
                },
                ko
              );
          },
          ko
        );
    });
  }

  static link (src, dest) {
    return new Promise((ok, ko) => {
      fs.symlink(src, dest, error => {
        // if ( error ) {
        //   return ko(error);
        // }
        ok();
      });
    });
  }
}

export default SymLink.create;
