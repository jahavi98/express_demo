const products = require("../../controllers/api/product.controller");
const express = require('express');
const {authJwt} = require("../../middleware");
const router = express.Router();


// Create a new products
router.post("/create", [authJwt.verifyToken], products.create);

// Retrieve all products
router.get("/list", [authJwt.verifyToken], products.findAll);

// Retrieve a single products with id
router.get("/:id", [authJwt.verifyToken], products.findOne);

// Update a products with id
router.put("/edit/:id", [authJwt.verifyToken], products.update);

// Delete a products with id
router.delete("/delete/:id", [authJwt.verifyToken], products.delete);

// Delete all products
router.delete("/", [authJwt.verifyToken], products.deleteAll);

module.exports = router;