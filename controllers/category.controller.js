const models = require("../models");
const Category = models.Category;
const {body, validationResult } = require('express-validator');
const multer = require("multer");
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const CsvParser = require("json2csv").Parser;
const excel = require("exceljs");
const moment = require('moment');
const { __ } = require("i18n");
const {where} = require("sequelize");


//all product home page
const allProduct = async (req,res) => {
    const data = await Category.findAll({
          raw:true,
    }).catch(error=>console.log(error));
    await res.render('chome',{data});
}


//new product created
const categoryForm = async (req,res) => {
    const category = await Category.findAll({
      raw:true,
    });
    console.log("***************",category)
    res.render('ccreate',{category:category,errors:'',token:req.csrfToken()});
}

//created product data save into database
const saveCategory = async (req,res) => {
 console.log("%%%%%%%%%%%%",req.body)
    //save product data
    let {category, status, image} = await req.body;
    const{parent_id} = req.body;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    console.log("files", req.files)

    let targetFile = req.files.image;
    let extName = path.extname(targetFile.name);
    let baseName = path.basename(targetFile.name, extName);
    let uploadDir = path.join(__dirname, '../public/downloads/', targetFile.name);

    console.log("extname", extName)
    console.log("baseName", baseName)
    console.log("uploadDir", uploadDir)

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
    console.log("+++++++++++++++++++++", image)


//all data save in database
    Category.create({
      category,status,image,parent_id
    }).catch(error => console.log(error));
    await res.redirect('/category');
}


//edit product page data
const editCategory = async (req,res) => {
    const {id} = await req.params;
    const category = await Category.findOne({
        where : {
            id:id
        },
        raw:true
    }).catch(error=>console.log(error));
    const allcategory = await Category.findAll({
        raw:true,
    });
    res.render('cedit',{category,allcategory});
}

//update edited data into the database
const updateCategory = async (req,res) => {
    const {id} = req.params;
    const dat = req.body;
    const selector = {where:{id:id}}
    await Category.update(dat, selector).catch(error=>console.log(error));
    res.redirect('/category');
}

//delete the product
const deleteProduct = async (req,res) => {
 const {id} = req.params;
        const category = await Category.destroy({
            where: {
                id: id
            }
        }).catch(error=>console.log(error));
        console.log("id",id)
        res.redirect('/category');
    }

module.exports = {
    allProduct, categoryForm, saveCategory, editCategory, updateCategory,deleteProduct
}
