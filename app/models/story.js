'use strict';

import { default as mongoose, Schema } from 'mongoose';

let schema = new Schema({
  "actors"        :   {
    "type"        :   Schema.Types.Mixed
  },
  "pitch"         :   {
    "type"        :   String,
    "required"    :   true
  },
  "unit"          :   {
    "atom"        :   {
      "type"      :   String,
      "required"  :   true
    },
    "params"      :   [Schema.Types.Mixed]
  },
  "driver"        :   {
    "url"         :   String,
    "viewport"    :   Schema.Types.Mixed,
    "session"     :   Schema.Types.Mixed,
    "env"         :   Schema.Types.Mixed
  }
});

export default mongoose.model('Story', schema);
