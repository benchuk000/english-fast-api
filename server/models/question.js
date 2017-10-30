const mongoose = require('mongoose');
const config = require('../config');
const ENGLISH_LEVEL = require('../constants/englishLevel');
const ENGLISH_TYPE = require('../constants/englishType');

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  level: { type: String, required: true, enum: [ 
    ENGLISH_LEVEL.ELEMENTARY,
    ENGLISH_LEVEL.PRE_INTERMEDIATE,
    ENGLISH_LEVEL.INTERMEDIATE 
  ]},
  type: { type: String, required: true, enum: [
    ENGLISH_TYPE.GRAMMAR,
    ENGLISH_TYPE.READING,
    ENGLISH_TYPE.LISTENING
  ]},
  theme: { type: String, required: true }, // TODO: Add topics enum.
  answers:  [ { type: String, required: true } ],
  trueAnswer: [ { type: Number, required: true } ]
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);