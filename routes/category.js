var express = require('express');
const {route} = require('.');
const {validatelogin} = require('../controllers/login.controller');
var router = express.Router();
var {
  allCategory,
  saveCategory,
  categoryForm,
  editCategory,
  updateCategory,
  deleteProduct
} = require('../controllers/category.controller');
const csrf = require('csurf')
const csrfprotect = csrf({cookie: true})

router.get('/', validatelogin, allCategory);
router.get('/ccreate', validatelogin, csrfprotect, categoryForm);
router.post('/ccreate', validatelogin, saveCategory);
router.get('/cedit/:id', validatelogin, editCategory);
router.post('/update/:id', validatelogin, updateCategory);
router.get('/delete/:id', validatelogin, deleteProduct);

module.exports = router;