const models = require("../models");
const Products = models.Products;
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
var pdf = require('html-pdf');


//all product home page
const allProduct = async (req,res) => {
    const data = await Products.findAll({
      where: {
        is_deleted:0
       },
        raw:true
    }).catch(error=>console.log(error));
    await res.render('phome',{data});
}

//new product created
const productForm = async (req,res) => {
    const category = await Category.findAll({
        raw:true,
    });
    await res.render('pcreate',{category:category,errors:'',token:req.csrfToken()});
}

//created product data save into database
const saveProduct = async (req,res) => {

    //validation error
    const errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()) {
        return res.render('pcreate', {errors: errors['errors'], token: req.body._csrf})
    }

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
            res.redirect('/products');
        });

        const test = await Products.create({
            name, pnumber, description, imgconvert, image, category, price, start_date, end_date, status
        }).catch(error => console.log(error));
        console.log(test)
        await res.redirect('/products');
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
            res.redirect('/products');
        });

        let targetFile = req.files.image;
        let extName = path.extname(targetFile.name);
        let baseName = path.basename(targetFile.name, extName);
        let uploadDir = path.join(__dirname, '../public/images/', targetFile.name);
        let upload = path.join(__dirname, '../public/tmp/', targetFile.name);

        console.log("extname", extName)
        console.log("baseName", baseName)
        console.log("uploadDir", uploadDir)
        console.log("upload", upload)

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

//for replace file name & store in folder public/tmp
        let timestamp = new Date().getTime();
        upload = upload.replace(baseName, timestamp);
        console.log("new upload", upload)

//for new name file store
        let convert = timestamp + extName;
        console.log(imgconvert)

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
        const test = await Products.create({
            name, pnumber, description, imgconvert, image, category, price, start_date, end_date, status
        }).catch(error => console.log(error));
        console.log(test)
        await res.redirect('/products');
    }
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
  if(id==req.params)
  {
    const errors = [{
                    
      msg: 'You can not delete your current login credentials'
      
    }]
    return  res.render('pedit');
  }
  else
  {
    const user = await Products.update({
        is_deleted:1
      }, {
        where: {
          id: id
        }
      }).catch(error=>console.log(error));
     console.log("id",id)
      res.redirect('/products');
    }
    
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


//pdf data format
const exportPdf = async (req, res,next) => {
    const product = {name:"Name", pnumber:"SKU", description:"Description", category:"Category", price:"Price", start_date:"Start_date",
        end_date:"End_Date", status:"Status"};

     let productdata = await Products.findAll({
         where: {
             is_deleted: 0
         },
        raw:true
    })
       let producthtml = await module.exports.preparehtml(productdata);
        // const jsonData = JSON.parse(JSON.stringify(product));
    let options = {
        "height": "420mm",
        "width": "297mm",
    }
        pdf.create(producthtml,options).toFile('public/pdf/product.pdf',function(err, res){
        console.log(res.filename);
    });

    res.download('public/pdf/product.pdf', 'product.pdf', (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
        res.setHeader(
        "Content-Type",
        "application/pdf"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "products.pdf"
    );

};

//prepare html table
const preparehtml = async (productdata) => {
    let html = '';
    html += '<table style="border: 1px solid black">' +
        '<thead>' +
        '<tr>' +
        '<th style="border: 1px solid black">Name</th>' +
        '<th style="border: 1px solid black">SKU</th>' +
        '<th style="border: 1px solid black">Description</th>' +
        '<th style="border: 1px solid black">Category</th>' +
        '<th style="border: 1px solid black">Price</th>' +
        '<th style="border: 1px solid black">Start_date</th>' +
        '<th style="border: 1px solid black">End_date</th>' +
        '<th style="border: 1px solid black">Status</th>' +
        '</tr>' +
        '</thead>';

    for(let i=0;i<productdata.length;i++)
    {
        let product = productdata[i];
        html += '<tbody>' +
            '<tr>' +
            '<td style="border: 1px solid black">'+product.name+'</td>' +
            '<td style="border: 1px solid black">'+product.pnumber+'</td>' +
            '<td style="border: 1px solid black">'+product.description+'</td>' +
            '<td style="border: 1px solid black">'+product.category+'</td>' +
            '<td style="border: 1px solid black">'+product.price+'</td>' +
            '<td style="border: 1px solid black">'+product.start_date+'</td>' +
            '<td style="border: 1px solid black">'+product.end_date+'</td>' +
            '<td style="border: 1px solid black">'+product.status+'</td>' +
            '</tr>' +
            '</tbody>'
    }
       html += '</table>';
       return html;
}


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
    allProduct,productForm, saveProduct, editProduct, updateProduct, deleteProduct, download, xlsx, exportPdf , preparehtml
}