var express = require('express');
const { route } = require('.');
var router = express.Router();
var {allUser, userForm, saveUser, editUser, updateUser, deleteUser} = require('../controllers/user.controller');
var {validatelogin} = require('../controllers/login.controller');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/', [validatelogin], allUser);

router.get('/create', userForm);
router.post('/create' ,saveUser);
router.get('/edit/:id',[validatelogin], editUser);
router.post('/update/:id',[validatelogin], updateUser);
router.get('/delete/:id',[validatelogin], deleteUser);


module.exports = router;
