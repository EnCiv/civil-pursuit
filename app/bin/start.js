#!/usr/bin/env node

'use strict';

import colors         from    'colors';
import fs             from    'fs';
import path           from    'path';
import { Domain }     from    'domain';
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
    console.log('connect to mongodb');
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
    console.log('get intro type');
    Type
      .findOne({ name : 'Intro' })
      .then(
        type => {
          try {
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
    console.log('get intro item');
    Item
      .findOne({ type : props.intro.type })
      .then(
        item => {
          try {
            if ( ! item ) {
              throw new Error('Intro item not found');
            }
            console.log('get intro panel item');
            item
              .toPanelItem()
              .then(
                item => {
                  try {
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
    console.log('start server');
    new Server({ intro : props.intro.item })
      .on('error', error => console.log(error.stack.red))
      .on('message', message => console.log(message));
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
    () => console.log('started'),
    error => console.log(error.stack)
  );
