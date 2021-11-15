var express = require('express');
var router = express.Router();
var {login,loginUser, logout} = require('../controllers/login.controller');




/* GET home page. */
router.get('/', login);
router.post('/',loginUser);
// router.get('/logout',logout);


module.exports = router;
