const mongoose = require('mongoose');
const _ = require('lodash');

const HistorySchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questions: [{ 
    question:   { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    isCorrect:  { type: Boolean, default: false },
    userAnswer: [ { type: Number } ],
  }],
  result: { type: Object }
}, { timestamps: true });

HistorySchema.pre('save', function (next) {
  const entity = this;

  if (entity.isModified('questions')) {
    entity.populate('questions.question').execPopulate()
      .then(entity => {
        const questions = entity.questions.map(item => item.question);
        const groupedQestionsByLevel = _.groupBy(questions, 'level');
        const groupedQestionsByLevelAndType = {};
        Object.keys(groupedQestionsByLevel).forEach(key =>
          groupedQestionsByLevelAndType[key] = _.groupBy(groupedQestionsByLevel[key], 'type')
        );

        Object.keys(groupedQestionsByLevelAndType).forEach(level => 
          Object.keys(groupedQestionsByLevelAndType[level]).forEach(type => {
            const questionsByLevelAndType = _.filter(questions, { level: level, type: type });
            const questionsGroupedById = _.groupBy(questionsByLevelAndType, '_id');
            const correctQuestions = _.filter(entity.questions, (item) => questionsGroupedById[item.question._id] && item.isCorrect);
            
            groupedQestionsByLevelAndType[level][type] = parseInt(correctQuestions.length * 100 / questionsByLevelAndType.length);
          })
        );

        entity.result = groupedQestionsByLevelAndType;

        next(entity);
      })
      .catch(err => next(err));
  }
});

module.exports = mongoose.model('History', HistorySchema);