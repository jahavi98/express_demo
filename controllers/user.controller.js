const models = require("../models");
const Users = models.Users;
const bcrypt = require('bcryptjs');
const CsvParser = require("json2csv").Parser;
var csrf = require('csurf');


const allUser = async (req,res) => {
    const data = await Users.findAll({
        where: {
          is_selected:0
         },
        raw:true
    }).catch(error=>console.log(error));
    await res.render('home',{data});
    console.log("data",data)
}

const userForm = async (req,res) => {
    await res.render('create',{title:'user registration page',errors:''});
}

const saveUser = async (req,res) => {
 let {name,username,password} = req.body;
 try{
  const user = await Users.findOne({

      where: {
          username: username ,
          is_selected:0
      }
    })
    if(user)
    {
      const errors = [{
      
        msg: 'This Username is already exist',
        
      }]
      return  res.render('users',{title:'my reg page',errors:errors})
     }
    else{
password = bcrypt.hashSync(password, 10);
const test = await Users.create({name,username,password});
}
 }
 catch(error)
 {
     console.log(error)
     return res.status(500).json(error)
 }   
 }
 
const editUser = async (req,res) => {
    const {id} = await req.params;
const user = await Users.findOne({
    where : {
        id:id
    },
     raw:true
}).catch(error=>console.log(error));
    res.render('edit',{errors:'',user});
}

const updateUser = async (req,res) => {
    const {id} = req.params;
    const dat = req.body;
    const selector = {where:{id:id}}
  await Users.update(dat, selector).catch(error=>console.log(error));
    res.redirect('/users');
}

const deleteUser = async (req,res) => {
 const {id} = req.params; 
  if(id==req.params)
  {
    const errors = [{
                    
      msg: 'You can not delete your current login credentials'
      
    }]
    return  res.render('edit');
  }
  else
  {
    const user = await Users.update({
        is_selected:1
      }, {
        where: {
          id: id
        }
      }).catch(error=>console.log(error));
     console.log("id",id)
      res.redirect('/users');
    }
    
}

module.exports = {
    allUser,userForm, saveUser, editUser, updateUser, deleteUser
}

