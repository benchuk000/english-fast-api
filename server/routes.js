const express  = require('express');
const router   = express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const user = require('./controllers/user');
router.get('/user/articles', user.getUserArticles);
router.get('/user', user.getUsers);
router.get('/user/:id', user.getUserById);
router.post('/user', user.createUser);
router.put('/user/:id', user.updateUserById);
router.delete('/user/:id', user.deleteUserById);

const auth = require('./controllers/auth');
router.get('/me', auth.signInByToken);
router.post('/signin', auth.signIn);
router.post('/signup', user.createUser);

const test = require('./controllers/test');
const history = require('./controllers/history');
router.get('/skills-test', test.getSkillsTest);
router.post('/generate/test', test.generateTest);
router.post('/complete/test', test.completeTest, history.createHistory, user.updateUserSkills);

const question = require('./controllers/question');
router.get('/question', question.getQuestions);
router.get('/question/:id', question.getQuestionById);
router.post('/question', question.createQuestion);
router.put('/question/:id', question.updateQuestionById);
router.delete('/question/:id', question.deleteQuestionById);

const article = require('./controllers/article');
router.get('/article', article.getArticles);
router.get('/article/:id', article.getArticleById);
router.post('/article', article.createArticle);
router.put('/article/:id', article.updateArticleById);
router.delete('/article/:id', article.deleteArticleById);

module.exports = router;