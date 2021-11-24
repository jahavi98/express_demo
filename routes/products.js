var express = require('express');
const { route } = require('.');
const { validatelogin } = require('../controllers/login.controller');
var router = express.Router();
var {allProduct,productForm, saveProduct, editProduct, updateProduct, deleteProduct, download, xlsx, exportPdf} = require('../controllers/product.controller');
const {validateproduct,result} = require('../controllers/productValidation');
const csrf = require('csurf')
const csrfprotect=csrf({cookie:true})

router.get('/', validatelogin, allProduct);
router.get('/pcreate', validatelogin, csrfprotect, productForm);
router.post('/pcreate' ,validatelogin, validateproduct, saveProduct);
router.get('/pedit/:id', validatelogin, editProduct);
router.post('/update/:id', validatelogin, updateProduct);
router.get('/delete/:id', validatelogin, deleteProduct);
router.get("/download", validatelogin, download);
router.get("/xlsx", validatelogin, xlsx);
router.get("/pdf", validatelogin, exportPdf);


module.exports = router;