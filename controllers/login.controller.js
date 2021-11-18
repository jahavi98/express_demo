const models = require("../models");
const Users = models.Users;
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'youraccesstokensecret';
const {body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const session = require('express-session');



const validatelogin = async (req,res,next) => {
    let userdata = req.session.userdata;
    console.log("sessiondata",req.session.userdata)
    if(userdata && userdata.id  && userdata.expires > userdata.set)
    { 
        console.log("udata",userdata)
        next();
    }
    else
    {
      console.log("edata",userdata)
       res.redirect('/');
    }
}

const login = async (req,res,next) => {
    let userdata = req.session.userdata;
    console.log("sessiondata",req.session.userdata)
    if(userdata && userdata.id  && userdata.expires > userdata.set)
    {
        next();
    }
    await res.render('login',{errors:''});
}


const loginUser = async (req,res) => {
     console.log("hello",req.body)
     const errors = validationResult(req)
     console.log(errors)
     if(!errors.isEmpty())
     {
      return  res.render('login',{errors:errors['errors'],token:req.body._csrf})
      
     }
    const {username} = req.body;
    const user = Users.findOne({
        where: {
            username: username
               }
   }).then(async (user)=> {
       console.log("user",user)
        if (!user) {
           res.redirect('/');
        } else {
    let passwordisVaild = bcrypt.compareSync(req.body.password,user.password);
       if (!passwordisVaild) {
           req.session.userdata = {}
           res.redirect('/');
       } else {
        let userdata = { 
            id:user.id,
            username:user.username,
            createdAt:user.createdAt,
            updatedAt:user.updatedAt,
            set: new Date(Date.now() + 900000),
            expires: new Date(Date.now() + 86400000)
        };
        
        {
        req.session.userdata = userdata;
         res.redirect('/users');
        }
              }       
              }
});
}
const logout = async(req,res) => {
   req.session.destroy()
   return res.redirect('/')
  }
  

module.exports = {
     loginUser, login , validatelogin, logout
}