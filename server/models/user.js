const mongoose = require('mongoose');
const config = require('../config');
const ENGLISH_LEVEL = require('../constants/englishLevel');
const ENGLISH_TYPE = require('../constants/englishType');

const userSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin:  { type: Boolean, default: false },
  level:    { type: String, enum: [ 
    ENGLISH_LEVEL.ELEMENTARY,
    ENGLISH_LEVEL.PRE_INTERMEDIATE,
    ENGLISH_LEVEL.INTERMEDIATE 
  ], default: ENGLISH_LEVEL.ELEMENTARY },
  skills: {
    [ENGLISH_TYPE.GRAMMAR]:   { type: Number, default: 0 },
    [ENGLISH_TYPE.READING]:   { type: Number, default: 0 },
    [ENGLISH_TYPE.LISTENING]: { type: Number, default: 0 },
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);