var express = require('express');
const { route } = require('.');
var router = express.Router();
var {allUser, userForm, saveUser, editUser, updateUser, deleteUser} = require('../controllers/user.controller');
var {validatelogin} = require('../controllers/login.controller');



router.get('/', [validatelogin], allUser);
router.get('/create',  userForm);
router.post('/create' ,saveUser);
router.get('/edit/:id', editUser);
router.post('/update/:id', updateUser);
router.get('/delete/:id', deleteUser);


module.exports = router;
