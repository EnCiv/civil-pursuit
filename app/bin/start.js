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
    Item
      .findOne({ type : props.intro.type })
      .then(
        item => {
          try {
            if ( ! item ) {
              throw new Error('Intro item not found');
            }
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
  );
