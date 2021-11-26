const express = require('express');
const router = express.Router();
const {login, loginUser, logout} = require('../controllers/login.controller');
const {loginvalid} = require('../controllers/uservalidation')
const csrf = require('csurf')
const csrfprotect = csrf({cookie: true})


/* GET home page. */
router.get('/', csrfprotect, login);
router.post('/', loginvalid, loginUser);
router.get('/logout', logout);


module.exports = router;
