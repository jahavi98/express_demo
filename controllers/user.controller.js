const models = require("../models");
const Users = models.Users;
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');



const allUser = async (req,res) => {
    const data = await Users.findAll({
        raw:true
    }).catch(error=>console.log(error));
    await res.render('home',{data});
}

const userForm = async (req,res) => {
    await res.render('create');
}

const saveUser = async (req,res) => {
 let {name,username,password} = req.body;
   
 check('name','Name is required')
   .notEmpty(),
 check('username', 'This username must me 3+ characters long')
        .exists()
         .notEmpty()
        .isLength({ min: 3 }),
        check('password', 'Password length should be 8 to 10 characters')
           .isLength({ min: 8, max: 10 })
        
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        // return res.status(422).jsonp(errors.array())
        const alert = errors.array()
        res.render('create', {
            alert
        })
    }
password = bcrypt.hashSync(password, 10);

const test = await Users.create({
    name,username,password
}).catch(error=>console.log(error));
console.log(test)
await res.redirect('/');

}

const editUser = async (req,res) => {
    const {id} = await req.params;
const user = await Users.findOne({
    where : {
        id:id
    },
     raw:true
}).catch(error=>console.log(error));
    res.render('edit',{user});
}

const updateUser = async (req,res) => {
    const {id} = req.params;
    const dat = req.body;
    const selector = {where:{id:id}}
  await Users.update(dat, selector).catch(error=>console.log(error));
    res.redirect('/');
}

const deleteUser = async (req,res) => {
    const {id} = req.params;
    const user = await Users.destroy({
        where:{
            id:id
        },
        raw:true
    }).catch(error=>console.log(error));
   
    res.redirect('/');
}

module.exports = {
    allUser,userForm, saveUser, editUser, updateUser, deleteUser
}