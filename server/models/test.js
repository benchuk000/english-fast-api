const mongoose = require('mongoose');
const config = require('../config');
const TEST_TYPE = require('../constants/testType');

const testSchema = new mongoose.Schema({
  questions:  [ { type: mongoose.Schema.Types.ObjectId, ref: 'Question', unique: true } ],
  name: { type: String, required: true, unique: true },
  isSkillsTest: { type: Boolean, default: false },
  type: { type: String, required: true, enum: [
    TEST_TYPE.SINGLE_CHOICE, 
    TEST_TYPE.MULTI_CHOICE, 
    TEST_TYPE.DRAG_AND_DROP
  ]}
});

module.exports = mongoose.model('Test', testSchema);