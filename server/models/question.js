const mongoose = require('mongoose');
const config = require('../config');
const ENGLISH_LEVEL = require('../constants/englishLevel');
const ENGLISH_THEME = require('../constants/englishTheme');

const questionSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: [ 'grammar', 'reading', 'listening' ] },
  theme: { type: String, required: true, enum: [
    ENGLISH_THEME.GRAMMAR,
    ENGLISH_THEME.READING,
    ENGLISH_THEME.LISTENING
  ]},
  title: { type: String, required: true },
  level: { type: String, required: true, enum: [ 
    ENGLISH_LEVEL.ELEMENTARY,
    ENGLISH_LEVEL.PRE_INTERMEDIATE,
    ENGLISH_LEVEL.INTERMEDIATE 
  ]},
  answers:  [ { type: String, required: true } ],
  trueAnswer: [ { type: Number, required: true } ]
});

module.exports = mongoose.model('Question', questionSchema);