const {authJwt} = require("../../middleware");
const users = require("../../controllers/api/user.controller");
const express = require('express');

const router = express.Router();

//create a token
router.post("/login", users.login);

// Create a new Users
router.post("/create", [authJwt.verifyToken], users.create);

// Retrieve all Users
router.get("/list", [authJwt.verifyToken], users.findAll);

// Retrieve a single Users with id
router.get("/:id", [authJwt.verifyToken], users.findOne);

// Update a Users with id
router.put("/edit/:id", [authJwt.verifyToken], users.update);

// Delete a Users with id
router.delete("/delete/:id", [authJwt.verifyToken], users.delete);

// Delete all Users
router.delete("/", [authJwt.verifyToken], users.deleteAll);

module.exports = router;
