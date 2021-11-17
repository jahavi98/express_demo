const products = require("../../controllers/api/product.controller");
var express = require('express');
const { authJwt } = require("../../middleware");
var router = express.Router();
  

  // Create a new Tutorial
  router.post("/create", [authJwt.verifyToken],products.create);

  // Retrieve all Tutorials
  router.get("/list",[authJwt.verifyToken], products.findAll);

  // Retrieve all published Tutorials
  router.get("/published",[authJwt.verifyToken], products.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", [authJwt.verifyToken],products.findOne);

  // Update a Tutorial with id
  router.put("/edit/:id",[authJwt.verifyToken], products.update);

  // Delete a Tutorial with id
  router.delete("/delete/:id",[authJwt.verifyToken], products.delete);

  // Delete all Tutorials
  router.delete("/", [authJwt.verifyToken],products.deleteAll);

  module.exports = router;