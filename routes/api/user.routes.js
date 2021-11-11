const { authJwt } = require("../../middleware");
const users = require("../../controllers/api/user.controller");
var express = require('express');

var router = express.Router();
  
  //create a token
  router.post("/login", users.login);

  // Create a new Tutorial
  router.post("/create",[authJwt.verifyToken],users.create);

  // Retrieve all Tutorials
  router.get("/list", [authJwt.verifyToken], users.findAll);

  // Retrieve all published Tutorials
  router.get("/published", [authJwt.verifyToken],users.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id",[authJwt.verifyToken],users.findOne);

  // Update a Tutorial with id
  router.put("/edit/:id", [authJwt.verifyToken],users.update);

  // Delete a Tutorial with id
  router.delete("/delete/:id", [authJwt.verifyToken], users.delete);

  // Delete all Tutorials
  router.delete("/", [authJwt.verifyToken],users.deleteAll);

  module.exports = router;
