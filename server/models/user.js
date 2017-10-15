const mongoose = require('mongoose');
const config = require('../config');
const ENGLISH_LEVEL = require('../constants/englishLevel');
const ENGLISH_THEME = require('../constants/englishTheme');

const userSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin:  { type: Boolean, default: false },
  level:    { type: Boolean, enum: [ 
    ENGLISH_LEVEL.ELEMENTARY,
    ENGLISH_LEVEL.PRE_INTERMEDIATE,
    ENGLISH_LEVEL.INTERMEDIATE 
  ]},
  skills: {
    [ENGLISH_THEME.GRAMMAR]:   { type: Number, default: 0 },
    [ENGLISH_THEME.READING]:   { type: Number, default: 0 },
    [ENGLISH_THEME.LISTENING]: { type: Number, default: 0 },
  }
});

module.exports = mongoose.model('User', userSchema);