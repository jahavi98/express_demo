const models = require("../../models");
const path = require("path");
const fs = require("fs");
const Products = models.Products;
const Op = models.Sequelize.Op;

// Create and Save a new product
exports.create = async (req, res) => {

  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Product
  const product = {
    name: req.body.name,
    pnumber: req.body.pnumber,
    price: req.body.price,
    description: req.body.description,
    imgconvert:req.body.imgconvert,
    image: req.body.image,
    status: req.body.status,
    start_date: req.body.start_date,
    end_date: req.body.end_date
  };

  // Save Product in the database
  if (!req.files) {
    //save product data
    let {
      name,
      pnumber,
      description,
      imgconvert,
      image,
      category,
      price,
      start_date,
      end_date,
      status
    } = await req.body;

    const product = await Products.update({
      is_deleted: 1,
      pnumber: 'DEL_' + pnumber
    }, {
      where: {
        pnumber: pnumber
      }
    }).then(function (product) {
      res.status(200);
    });

    Products.create({
      name, pnumber, description, imgconvert, image, category, price, start_date, end_date, status
    }).then(data => {
      res.send(data);
    })
        .catch(err => {
          res.status(500).send({
            message:
                err.message || "Some error occurred while creating the Product."
          });
        });
  } else {
    let {
      name,
      pnumber,
      description,
      imgconvert,
      image,
      category,
      price,
      start_date,
      end_date,
      status
    } = await req.body;
    const product = await Products.update({
      is_deleted: 1,
      pnumber: 'DEL_' + pnumber
    }, {
      where: {
        pnumber: pnumber
      }
    }).then(function (product) {
      res.status(200);
    });

    let targetFile = req.files.image;
    let extName = path.extname(targetFile.name);
    let baseName = path.basename(targetFile.name, extName);
    let uploadDir = path.join(__dirname, '../../public/images/', targetFile.name);
    let upload = path.join(__dirname, '../../public/tmp/', targetFile.name);


    let imgList = ['.png', '.jpg', '.jpeg', '.gif'];

// Checking the file type
    if (!imgList.includes(extName)) {
      fs.unlinkSync(targetFile.tempFilePath);
      return res.status(422).send("Invalid Image");
    }

    if (targetFile.size > 1048576) {
      fs.unlinkSync(targetFile.tempFilePath);
      console.log("target file", targetfile.size)
      return res.status(413).send("File is too Large");
    }
//save original image in public/images
    targetFile.mv(uploadDir, (err) => {
      if (err) {
        console.log("targetfile err", err)
        return res.status(500).send(err);
      }
    });

//save image name in database
    image = baseName + extName;

//for replace file name & store in folder public/tmp
    let timestamp = new Date().getTime();
    upload = upload.replace(baseName, timestamp);

//for new name file store
    let convert = timestamp + extName;

    targetFile.mv(upload, (err) => {
      if (err) {
        console.log("targetfile err", err)
        return res.status(500).send(err);
      }
    });

//save imgconvert name in the database
    imgconvert = convert;
    console.log("************", imgconvert)

//all data save in database
    Products.create({
      name, pnumber, description, imgconvert, image, category, price, start_date, end_date, status
    }).then(data => {
      res.send(data);
    })
        .catch(err => {
          res.status(500).send({
            message:
                err.message || "Some error occurred while creating the Product."
          });
        });
  }
};

// Retrieve all Products from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  // var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Products.findAll({
    where: {
      is_deleted:0
     },
      raw:true
  }).then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving products."
      });
    });
};

// Find a single product with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Products.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Products with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving products with id=" + id
      });
    });
};

// Update a product by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Products.update(req.body, {
    where: { id: id }
  })
    .then(id => {
      if (id == 1) {
        res.send({
          message: "Product was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Product with id=" + id
      });
    });
};

// Delete a product with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Products.update({
    is_deleted:1
  }, {
    where: {
      id: id
    }
  })
    .then(id => {
      if (id == 1) {
        res.send({
          message: "Product was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete product with id=${id}. Maybe product was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete product with id=" + id
      });
    });
};

// Delete all Products from the database.
exports.deleteAll = (req, res) => {
  Products.destroy({
    where: {},
    truncate: false
  })
    .then(id => {
      res.send({ message: `${id} Products were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all products."
      });
    });
};

// Find all published Products
exports.findAllPublished = (req, res) => {
  Products.findAll({ where: { published: true } })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving products."
    });
  });
};