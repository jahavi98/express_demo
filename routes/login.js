var express = require('express');
var router = express.Router();
var {login,loginUser} = require('../controllers/login.controller');
var csrf = require('csurf');
const csrfprotect=csrf({cookie:true});




/* GET home page. */
router.get('/',csrfprotect, login);
router.post('/',loginUser);

module.exports = router;
