const category = require("../../controllers/api/category.controller");
var express = require('express');
const { authJwt } = require("../../middleware");
var router = express.Router();


// Create a new Tutorial
router.post("/create", [authJwt.verifyToken], category.create);

// Retrieve all Tutorials
router.get("/list",[authJwt.verifyToken], category.findAll);

// Retrieve all published Tutorials
router.get("/published",[authJwt.verifyToken], category.findAllPublished);

// Retrieve a single Tutorial with id
router.get("/:id", [authJwt.verifyToken], category.findOne);

// Update a Tutorial with id
router.put("/edit/:id",[authJwt.verifyToken], category.update);

// Delete a Tutorial with id
router.delete("/delete/:id",[authJwt.verifyToken], category.delete);

// Delete all Tutorials
router.delete("/", [authJwt.verifyToken], category.deleteAll);

module.exports = router;