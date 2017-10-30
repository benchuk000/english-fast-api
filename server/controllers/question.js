'use strict';

const Question = require('../models/question');

exports.createQuestion = (req, res, next) => {
  let body = req.body;
  const question = new Question(body);

  question.save()
    .then(savedQuestion => res.send(savedQuestion))
    .catch(err => next(err))
};

exports.getQuestions = (req, res, next) => {
  Question.find()
    .sort({[req.query.sort]: req.query.sortDir === 'ASC' ? 1 : -1})
    .exec()
    .then(questions => res.send(questions))
    .catch(err => next(err));
}

exports.getQuestionById = (req, res, next) => {
  let id = req.params.id;

  Question.find({ _id: id }).exec()
    .then(question => res.send(question))
    .catch(err => next(err))
};

exports.updateQuestionById = (req, res, next) => {
  let id = req.params.id;
  let body = req.body;

  Question.findByIdAndUpdate(id, { $set: body }).exec()
    .then(updatedQuestion => res.send(updatedQuestion))
    .catch(err => next(err));
}

exports.deleteQuestionById = (req, res, next) => {
  let id = req.params.id;

  Question.findByIdAndRemove(id).exec()
    .then(removedQuestion => res.send(removedQuestion))
    .catch(err => next(err));
}