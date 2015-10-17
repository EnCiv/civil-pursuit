#!/usr/bin/env node

'use strict';

import colors         from    'colors';
import config         from    '../../secret.json';
import Mung           from    '../lib/mung';
import Server         from    '../server';
import Item           from    '../models/item';
import Type           from    '../models/type';
import sequencer      from    '../lib/util/sequencer';

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

if ( process.env.NODE_ENV === 'production' ) {
  process.title = 'synappprod';
}

else {
  process.title = 'synappdev';
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const connectToDB = props => new Promise((ok, ko) => {
  try {
    console.log('connect to DB', process.env.MONGOHQ_URL)
    Mung.connect(process.env.MONGOHQ_URL)
      .on('error', ko)
      .on('connected', ok);
  }
  catch ( error ) {
    ko(error);
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const getIntroType = props => new Promise((ok, ko) => {
  try {
    console.log('Get intro trype');;
    Type
      .findOne({ name : config['top level item'] })
      .then(
        type => {
          try {
            console.log('got intro type', type)
            if ( ! type ) {
              throw new Error('Intro type not found');
            }
            props.intro = { type };
            ok();
          }
          catch ( error ) {
            ko(error);
          }
        },
        ko
      );
  }
  catch ( error ) {
    ko(error);
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const getIntroItem = props => new Promise((ok, ko) => {
  try {
    console.log('get intro item', props.intro)
    Item
      .findOne( props.intro )
      .then(
        item => {
          try {
            console.log('got intro item', item)
            if ( ! item ) {
              throw new Error('Intro item not found');
            }
            item
              .toPanelItem()
              .then(
                item => {
                  try {
                    consoe.log('got panel item' , item)
                    props.intro.item = item;
                    ok()
                  }
                  catch ( error ) {
                    ko(error);
                  }
                },
                ko
              );
          }
          catch ( error ) {
            ko(error);
          }
        },
        ko
      );
  }
  catch ( error ) {
    ko(error);
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const startServer = props => new Promise((ok, ko) => {
  try {
    console.log('connecting server', props.intro.item)
    new Server({ intro : props.intro.item })
  }
  catch ( error ) {
    ko(error);
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

sequencer([
  connectToDB,
  getIntroType,
  getIntroItem,
  startServer
])
  .then(
    () => console.log('Started!'),
    error => {
      console.log(error.stack);
    }
  );
