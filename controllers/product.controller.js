const models = require("../models");
const Products = models.Products;
const { check, validationResult } = require('express-validator');
const multer = require("multer");
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const CsvParser = require("json2csv").Parser;
const excel = require("exceljs");
const PDFDocument = require("pdfkit");


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
      let product = [];
    
      const csvFields = {name:"Name", pnumber:"SKU", description:"Description", category:"Category", price:"Price", start_date:"Start_date", 
      end_date:"End_Date", status:"Status"};
      
      product.push(csvFields);
      objs.forEach((obj) => {
        const {name,pnumber,description,category,price,start_date,end_date,status} = obj;
        product.push({ name,pnumber,description,category,price,start_date,end_date,status});

      });
      console.log("product",product)
      const csvParser = new CsvParser({header:false});
      const csvData = csvParser.parse(product);
  
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=product.csv");
  
      res.status(200).end(csvData);
    });
  };


//pdf data fromat
const docu = (req, res) => {

function createInvoice(Products) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateInvoiceTable(doc, Products);

  doc.end();
  doc.pipe(fs.createWriteStream('products.pdf'));}

function generateInvoiceTable(doc, Products) {
  let i;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    "Name",
    "SKU",
    "Description",
    "Category",
    "Price",
    "Start_Date",
    "End_Date",
    "Status"
  );
  doc.font("Helvetica");

  for (i = 0; i < Products.id.length; i++) {
    const product = Products.id[i];
    generateTableRow(
      doc,
      product.name,
      product.pnumber,
      product.description,
      product.category,
      product.start_date,
      product.end_date,
      product.status
    );
  }

  function generateTableRow(
    doc,
    y,
    name,
    pnumber,
    description,
    category,
    price,
    start_date,
    end_date,
    status
  ) {
    doc
      .fontSize(10)
      .text(name, 50, y)
      .text(pnumber,50,y)
      .text(description, 150, y)
      .text(category, 280, y, { width: 90, align: "right" })
      .text(price, 370, y, { width: 90, align: "right" })
      .text(start_date, 370, y, { width: 90, align: "right" })
      .text(end_date, 370, y, { width: 90, align: "right" })
      .text(status, 370, y, { width: 90, align: "right" })
  }

}
};
//xls data format
const xlsx = (req, res) => {
  Products.findAll().then((objs) => {
    let data = [];

    objs.forEach((obj) => {
      data.push({
        name: obj.name,
        pnumber: obj.pnumber,
        description: obj.description,
        category: obj.category,
        price: obj.price,
        start_date: obj.start_date,
        end_date: obj.end_date,
        status :obj.status,
      });
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Products");

    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "SKU", key: "pnumber", width: 25 },
      { header: "Description", key: "description", width: 10 },
      { header: "Category", key: "category", width: 10 },
      { header: "Price", key: "price", width: 10 },
      { header: "Start_Date", key: "start_date", width: 10 },
      { header: "End_Date", key: "end_date", width: 10 },
      { header: "Status", key: "status", width: 10 },

    ];

    // Add Array Rows
    worksheet.addRows(data);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "products.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });
};

module.exports = {
    allProduct,productForm, saveProduct, editProduct, updateProduct, deleteProduct, download, xlsx, docu
}















//pdf data format
// const pdoc = async (req,res,next) => {
//   Products.findAll().then((objs) => {
//     let product = [];

//     objs.forEach((obj) => {
//       const {name,pnumber,description,category,price,start_date,end_date,status} = obj;
//       product.push({ name,pnumber,description,category,price,start_date,end_date,status});
//     });
//   console.log("product",product)
//   const jsonData = JSON.parse(JSON.stringify(product));
//   console.log("json",jsonData)
//   res.render('phome',{product:jsonData}, (err, data) => {
//     if (err) {
//           res.send(err);
//     }else{
//       var options = {
//         "height": "11.25in",
//         "width": "8.5in",
//         "header": {
//             "height": "20mm"
//         },
//         "footer": {
//             "height": "20mm",
//         },
//       };
//     }
//     pdf.create(data, options).toFile("./public/downloads/product.pdf", function (err, data) {
//       if (err) {
//           res.send(err);
//       } else {
//          res.status(200).end();
//       }
//     });
//   });
// });
// }; 

