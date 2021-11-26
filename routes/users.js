const express = require('express');
const {route} = require('.');
const router = express.Router();
const {
  allUser,
  userForm,
  saveUser,
  editUser,
  updateUser,
  deleteUser,
  email
} = require('../controllers/user.controller');
const {validatelogin} = require('../controllers/login.controller');
const {validateuser, result} = require('../controllers/uservalidation');
const jwt = require('jsonwebtoken');
const csrf = require('csurf')
const csrfprotect = csrf({cookie: true})

router.get('/', validatelogin, allUser);
router.get('/create', csrfprotect, userForm);
router.post('/create', validateuser, saveUser);
router.get('/edit/:id', validatelogin, editUser);
router.post('/update/:id', validatelogin, updateUser);
router.get('/delete/:id', validatelogin, deleteUser);

module.exports = router;
