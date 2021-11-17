var express = require('express');
var router = express.Router();
var {login,loginUser, logout} = require('../controllers/login.controller');
const {loginvalid} = require('../controllers/uservalidation')



/* GET home page. */
router.get('/', login);
router.post('/', loginvalid, loginUser);
router.get('/logout',logout);


module.exports = router;
