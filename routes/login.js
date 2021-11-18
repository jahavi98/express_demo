var express = require('express');
var router = express.Router();
var {login,loginUser, logout} = require('../controllers/login.controller');
const {loginvalid} = require('../controllers/uservalidation')
const csrf = require('csurf')
const csrfprotect=csrf({cookie:true})


/* GET home page. */
router.get('/', csrfprotect, login);
router.post('/', loginvalid, loginUser);
router.get('/logout',logout);


module.exports = router;
