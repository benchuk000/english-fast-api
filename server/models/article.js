const mongoose = require('mongoose');
const config = require('../config');

const articleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  theme: { type: String, required: true }, 
  content: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);