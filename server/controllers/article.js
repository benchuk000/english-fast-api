'use strict';

const Article = require('../models/article');

exports.createArticle = (req, res, next) => {
  let body = req.body;
  const article = new Article(body);

  article.save()
    .then(savedArticle => res.send(savedArticle))
    .catch(err => next(err))
};

exports.getArticles = (req, res, next) => {
  Article.find()
    .sort({[req.query.sort]: req.query.sortDir === 'ASC' ? 1 : -1})
    .exec()
    .then(articles => res.send(articles))
    .catch(err => next(err));
}

exports.getArticleById = (req, res, next) => {
  let id = req.params.id;

  Article.findById(id).exec()
    .then(article => res.send(article))
    .catch(err => next(err))
};

exports.updateArticleById = (req, res, next) => {
  let id = req.params.id;
  let body = req.body;

  Article.findByIdAndUpdate(id, { $set: body }, { new: true }).exec()
    .then(updatedArticle => res.send(updatedArticle))
    .catch(err => next(err));
}

exports.deleteArticleById = (req, res, next) => {
  let id = req.params.id;

  Article.findByIdAndRemove(id).exec()
    .then(removedArticle => res.send(removedArticle))
    .catch(err => next(err));
}