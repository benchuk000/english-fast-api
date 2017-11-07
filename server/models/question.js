const mongoose = require('mongoose');
const config = require('../config');
const ENGLISH_LEVEL = require('../constants/englishLevel');
const ENGLISH_TYPE = require('../constants/englishType');
const ANSWER_TYPE = require('../constants/answerType');

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  answerType: { type: String, default: ANSWER_TYPE.SINGLE_CHOICE, required: true, enum: [
    ANSWER_TYPE.SINGLE_CHOICE,
    ANSWER_TYPE.MULTI_CHOICE, 
    ANSWER_TYPE.DRAG_AND_DROP,
  ]},
  level: { type: String, required: true, enum: [ 
    ENGLISH_LEVEL.ELEMENTARY,
    ENGLISH_LEVEL.PRE_INTERMEDIATE,
    ENGLISH_LEVEL.INTERMEDIATE,
  ]},
  type: { type: String, required: true, enum: [
    ENGLISH_TYPE.GRAMMAR,
    ENGLISH_TYPE.READING,
    ENGLISH_TYPE.LISTENING,
  ]},
  theme: { type: String, required: true }, // TODO: Add topics enum.
  answers:  [ {
    title: { type: String, required: true },
    isCorrect: { type: Boolean, default: false },
  } ],
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);