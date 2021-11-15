var express = require('express');
const { route } = require('.');
const { validatelogin } = require('../controllers/login.controller');
var router = express.Router();
var {allProduct,productForm, saveProduct, editProduct, updateProduct, deleteProduct, download, xlsx} = require('../controllers/product.controller');


router.get('/', validatelogin, allProduct);
router.get('/pcreate', validatelogin, productForm);
router.post('/pcreate' ,validatelogin, saveProduct);
router.get('/pedit/:id', validatelogin, editProduct);
router.post('/update/:id', validatelogin, updateProduct);
router.get('/delete/:id', validatelogin, deleteProduct);
router.get("/download", validatelogin, download);
router.get("/xlsx", validatelogin, xlsx); 

module.exports = router;