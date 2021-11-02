const models = require("../models");
const Products = models.Products;
const { check, validationResult } = require('express-validator');
const multer = require("multer");
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
var moment = require('moment-timezone');
const CsvParser = require("json2csv").Parser;


//all product home page 
const allProduct = async (req,res) => {
  console.log(res.__("text_test"),"translation")
    const data = await Products.findAll({
        raw:true
    }).catch(error=>console.log(error));
    await res.render('phome',{data});
}

//new product created
const productForm = async (req,res) => {
    await res.render('pcreate');
}

//created product data save into database
const saveProduct = async (req,res) => {
 let {name,pnumber,description,image,category,price,start_date,end_date,status} = await req.body;

 if (!req.files || Object.keys(req.files).length === 0) {
  return res.status(400).send('No files were uploaded.');
}
console.log("files",req.files)

let targetFile = req.files.image;
let extName = path.extname(targetFile.name);
let baseName = path.basename(targetFile.name, extName);
let uploadDir = path.join(__dirname, '../public/images/', targetFile.name);

console.log("extname",extName)
console.log("baseName",baseName)
console.log("uploadDir",uploadDir)

let imgList = ['.png','.jpg','.jpeg','.gif'];

// Checking the file type
if(!imgList.includes(extName)){
  fs.unlinkSync(targetFile.tempFilePath);
  return res.status(422).send("Invalid Image");
}

if(targetFile.size > 1048576){
  fs.unlinkSync(targetFile.tempFilePath);
  console.log("target file",targetfile.size)
  return res.status(413).send("File is too Large");
}
//for replace file name & store in folder
let timestamp = new Date().getTime();
uploadDir = uploadDir.replace(baseName,timestamp);
console.log("new upload",uploadDir)

//for new name file store
let imgconvert = timestamp + extName;
console.log(imgconvert)

targetFile.mv(uploadDir, (err) => {
  if (err) {
    console.log("targetfile err", err)
    return res.status(500).send(err);
  }
});

const test = await Products.create({
    name,pnumber,description,image,category,price,start_date,end_date,status,imgconvert
}).catch(error=>console.log(error));
console.log(test)
await res.redirect('/products');
   
}

//edit product page data
const editProduct = async (req,res) => {
    const {id} = await req.params;
const product = await Products.findOne({
    where : {
        id:id
    },
     raw:true
}).catch(error=>console.log(error));
    res.render('pedit',{product});
}

//update edited data into the database
const updateProduct = async (req,res) => {
    const {id} = req.params;
    const dat = req.body;
    const selector = {where:{id:id}}
  await Products.update(dat, selector).catch(error=>console.log(error));
    res.redirect('/products');
}

//delete the product
const deleteProduct = async (req,res) => {
    const {id} = req.params;
    const product = await Products.destroy({
        where:{
            id:id
        },
        raw:true
    }).catch(error=>console.log(error));
   
    res.redirect('/products');
}

//csv data download
const download = (req, res) => {
    Products.findAll().then((objs) => {
      let data = [];
  
      objs.forEach((obj) => {
        const {name,pnumber,description,category,price,start_date,end_date,status} = obj;
        data.push({ name,pnumber,description,category,price,start_date,end_date,status});
      });
  
      const csvFields = ["Name", "SKU", "Description", "Category", "Price", "Start_date", "End_Date", "Status"];
      const csvParser = new CsvParser({ csvFields });
      const csvData = csvParser.parse(data);
  
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=productdata.csv");
  
      res.status(200).end(csvData);
    });
  };

module.exports = {
    allProduct,productForm, saveProduct, editProduct, updateProduct, deleteProduct, download
}