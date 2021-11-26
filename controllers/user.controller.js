const models = require("../models");
const Users = models.Users;
const bcrypt = require('bcryptjs');
const CsvParser = require("json2csv").Parser;
const csrf = require('csurf');
const {body, validationResult} = require('express-validator');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');


//all user home page
const allUser = async (req, res) => {
  const data = await Users.findAll({
    where: {
      is_selected: 0
    },
    raw: true
  }).catch(error => console.log(error));
  await res.render('home', {data});
}


//new user created
const userForm = async (req, res) => {
  await res.render('create', {errors: '', token: req.csrfToken()});
}


//created user data save into database
const saveUser = async (req, res) => {

//validation error
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render('create', {errors: errors['errors'], token: req.body._csrf})
  }

//mail send
  const transporter = nodemailer.createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
      user: 'jahnavi.bhagat.hs@gmail.com',
      pass: 'Jahnavi@3108',
    },
    secure: true,
    service: 'gmail'
  });

  let {name, username, password, to} = req.body;

  const mailData = {
    from: '"Management" <jahnavi.bhagat.hs@gmail.com>',
    to: req.body.to,
    subject: 'Registration',
    text: 'Successfully Registered'
  }
  console.log("----------------------------", mailData)
  password = bcrypt.hashSync(password, 10);
  Users.create({
    name, username, password, to
  }).then(function (user) {
    console.log("*****************************************")
    transporter.sendMail(mailData, function (error, info) {
      console.log("innnnnnnnnnnnnnnnnnnnnnn")
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ', info);
      }
    })
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
    res.redirect('/users');
  });
}

//edit user page data
const editUser = async (req, res) => {
  const {id} = await req.params;
  const user = await Users.findOne({
    where: {
      id: id
    },
    raw: true
  }).catch(error => console.log(error));
  res.render('edit', {errors: '', user});
}


//update edited data into the database
const updateUser = async (req, res) => {
  const {id} = req.params;
  const dat = req.body;
  const selector = {where: {id: id}}
  await Users.update(dat, selector).catch(error => console.log(error));
  res.redirect('/users');
}


//delete the user
const deleteUser = async (req, res) => {
  const {id} = req.params;
  if (id == req.params) {
    const errors = [{

      msg: 'You can not delete your current login credentials'

    }]
    return res.render('edit');
  } else {
    const user = await Users.update({
      is_selected: 1
    }, {
      where: {
        id: id
      }
    }).catch(error => console.log(error));
    console.log("id", id)
    res.redirect('/users');
  }

}

module.exports = {
  allUser, userForm, saveUser, editUser, updateUser, deleteUser
}


