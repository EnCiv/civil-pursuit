/**
 * The Text Model
 * 
 * @module Models
 * @author francoisrvespa@gmail.com
*/

! function () {

  'use strict';

  var mongoose = require('mongoose');

  var Schema = mongoose.Schema;

  var TextSchema = new Schema({
    "label"         :   String,
    "en-us"         :   String
  });

  module.exports = mongoose.model('Text', TextSchema);

} ();
