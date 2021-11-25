const models = require("../../models");
const Category = models.Category;
const Op = models.Sequelize.Op;

// Create and Save a new category
exports.create = (req, res) => {

    if (!req.body.category) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Category
    const category = {
        category: req.body.category,
        status: req.body.status,
        image:req.body.image,
    };

    // Save Catgeory in the database
    Category.create(category)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the category."
            });
        });
};

// Retrieve all Category from the database.
exports.findAll = (req, res) => {
    const category = req.query.category;
    Category.findAll({
    where:{
              isdelete:0
    },
        raw:true
    }).then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving category."
            });
        });
};

// Find a single category with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Category.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find category with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving category with id=" + id
            });
        });
};

// Update a category by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Category.update(req.body, {
        where: { id: id }
    })
        .then(id => {
            if (id == 1) {
                res.send({
                    message: "Category was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Category with id=${id}. Maybe Category was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Category with id=" + id
            });
        });
};

// Delete a category with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Category.update({
        isdelete:1
    }, {
        where: {
            id: id
        }
    })
        .then(id => {
            if (id == 1) {
                res.send({
                    message: "Category was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete category with id=${id}. Maybe category was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete category with id=" + id
            });
        });
};

// Delete all Category from the database.
exports.deleteAll = (req, res) => {
    Category.destroy({
        where: {},
        truncate: false
    })
        .then(id => {
            res.send({ message: `${id} Category were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all category."
            });
        });
};

// Find all published Category
exports.findAllPublished = (req, res) => {
    Category.findAll({ where: { published: true } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Category."
            });
        });
};