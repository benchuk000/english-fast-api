'use strict';

const Question = require('../models/question');
const Test = require('../models/test');
const _ = require('lodash');

exports.getSkillsTest = (req, res, next) => {
  Test.findOne({ isSkillsTest: true }).populate('questions').exec()
    .then(test => res.send(test))
    .catch(err => next(err))
};

exports.generateTest = (req, res, next) => {
  const params = req.body.params || {};
  const limit = req.body.limit || 30;
  const query = {};

  Object.keys(params || {}).forEach((param) => {
    if (params[param] && params[param].length) {
      query[param] = { $in: params[param] };
    }
  });

  Question.find(query)
    .then((questions) => {
      let maxCount = questions.length > limit ? limit : questions.length;
      const result = [];

      for (let questionIndex = 0; questionIndex < maxCount; questionIndex++) {
        const randomIndex = parseInt(Math.random() * maxCount);
    
        result.push(questions[randomIndex]);
      }

      res.send(result);
    })
    .catch(err => next(err));
}

exports.completeTest = (req, res, next) => {
  const body = req.body;

  Question.find({ _id: { $in: Object.keys(body.answers) }})
    .then((questions) => {
      const result = Object.keys(body.answers).map(questionId => {
        const question = _.find(questions, question => question._id.equals(questionId));
        const answers = question.answers;
        const trueAnswer = [];

        for (let index = 0; index < answers.length; index++) {
          if (answers[index].isCorrect) {
            trueAnswer.push(index);
          }
        }

        return {
          question: questionId,
          isCorrect: _.isEqual(trueAnswer, body.answers[questionId]),
          userAnswer: body.answers[questionId]
        }
      });

      const response = {
        result
      };

      req.body = response;

      next();
    })
    .catch(err => next(err));
}