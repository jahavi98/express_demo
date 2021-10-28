var express = require('express');
var router = express.Router();
var {login,loginUser} = require('../controllers/login.controller');




/* GET home page. */
router.get('/',login);
router.post('/',loginUser);

module.exports = router;
