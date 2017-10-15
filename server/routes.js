const express  = require('express');
const router   = express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const user = require('./controllers/user');
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
router.get('/test', test.getTests);
router.get('/test/:id', test.getTestById);
router.post('/test', test.createTest);
router.put('/test/:id', test.updateTestById);
router.delete('/test/:id', test.deleteTestById);
router.get('/skills-test', test.getSkillsTest);
router.post('/complete/test/:id', test.completeTestById);

const question = require('./controllers/question');
router.get('/question', question.getQuestions);
router.get('/question/:id', question.getQuestionById);
router.post('/question', question.createQuestion);
router.put('/question/:id', question.updateQuestionById);
router.delete('/question/:id', question.deleteQuestionById);

module.exports = router;