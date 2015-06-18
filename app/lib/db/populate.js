'use strict';

import fs from 'fs';
import path from 'path';
import config from 'syn/config.json';
import UserModel from 'syn/models/User';
import TypeModel from 'syn/models/Type';
import ItemModel from 'syn/models/Item';
import v2 from '../../../migrations/v2';
import mongoose from 'mongoose';

class PopulateDB {

  constructor () {
    mongoose.connect(process.env.MONGOHQ_URL);
    this.users = [];
  }

  fill () {
    return new Promise((ok, ko) => {
      console.log('.. Populate Users');

      this.fillUser(15).then(
        () => {
          console.log('OK Populate Users');
          console.log('.. Populate Intro');
          this.fillIntro().then(
            () => {
              console.log('OK Populate Intro');
              console.log('.. Populate Types');
              this.fillTypes().then(
                () => {
                  console.log('OK Populate Types');
                  console.log('.. Populate Items');
                  this.fillItems(100).then(
                    () => {
                      console.log('OK Populate Items');
                      ok();
                    },
                    ko
                  );
                },
                ko
              );
            },
            ko
          );
        },
        ko
      );
    });
  }

  fillUser (n) {
    return new Promise((ok, ko) => {

      for ( let i = 0; i < n ; i ++ ) {
        UserModel
          .disposable()
          .then(
            user => {
              this.users.push(user);
              ok();
            },
            ko
          );
      }

    });
  }

  fillIntro () {
    return new Promise((ok, ko) => {
      TypeModel
        .findOne({ name : 'Intro' })
        .exec((error, type) => {
          if ( error ) {
            return ko(error);
          }
          if ( type ) {
            return ok();
          }
          TypeModel
            .create({ name : 'Intro' }, (error, created) => {
              if ( error ) {
                return ko(error);
              }
              this.intro = { type : created };
              let intro = '';
              fs
                .createReadStream(path.resolve(__dirname, '../../../intro.md'))
                .on('data', data => intro += data.toString())
                .on('end', () => {
                  ItemModel
                    .create({
                      user        :   this.users[0],
                      subject     :   'Intro',
                      description :   intro,
                      type        :   created._id
                    }, (error, created) => {
                      if ( error ) {
                        return ko(error);
                      }
                      this.intro.item = created;
                      ok();
                    });
                });
            });
        });
    });
  }

  fillTypes () {
    return v2().then((o) => console.log('v2 oooo'));
  }

  fillItems (n) {
    return new Promise((ok, ko) => {
      let promises = [];

      for ( let i = 0; i < n ; i ++ ) {
        promises.push(ItemModel.disposable());
      }

      Promise.all(promises).then(ok, ko);
    });
  }

}

export default PopulateDB;
