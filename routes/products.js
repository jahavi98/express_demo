var express = require('express');
const { route } = require('.');
var router = express.Router();
var {allProduct,productForm, saveProduct, editProduct, updateProduct, deleteProduct, download} = require('../controllers/product.controller');
//var {validatelogin} = require('../controllers/login.controller');

router.get('/', allProduct);
router.get('/pcreate', productForm);
router.post('/pcreate' ,saveProduct);
router.get('/pedit/:id', editProduct);
router.post('/update/:id', updateProduct);
router.get('/delete/:id', deleteProduct);
router.get("/download", download);


module.exports = router;