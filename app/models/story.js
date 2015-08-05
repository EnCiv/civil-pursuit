'use strict';

import { default as mongoose, Schema } from 'mongoose';

import Page from './page';

let schema = new Schema({
  "actors"              :   {
    "type"              :   Schema.Types.Mixed
  },
  "pitch"               :   {
    "type"              :   String,
    "required"          :   true
  },
  "description"         :   {
    "type"              :   String
  },
  "unit"                :   {
    "atom"              :   {
      "type"            :   String,
      "required"        :   true
    },
    "params"            :   [Schema.Types.Mixed]
  },
  "driver"              :   {
    "page"              :   {
      "type"            :   Schema.Types.ObjectId,
      "ref"             :   "Page"
    },
    "env"               :   {
      "development"     :   Boolean,
      "production"      :   Boolean
    },
    "vendor"            :   {
      "firefox"         :   Boolean,
      "chrome"          :   Boolean
    },
    "viewport"          :   {
      "watch"           :   Boolean,
      "phone"           :   Boolean,
      "split"           :   Boolean,
      "tablet"          :   Boolean,
      "desktop"         :   Boolean
    }
  }
});

export default mongoose.model('Story', schema);
