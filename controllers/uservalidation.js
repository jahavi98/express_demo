const {body,validationResult} = require('express-validator');

exports.validateuser = [
    body('name','Name should be required').notEmpty(),
    body('username','UserName should be Unique').notEmpty(),
    body('email','Email should be required').notEmpty(),
    body('password','Password should be more than 5 character').isLength({min:5}),
]


exports.result = async(req,res,next)=>
{
    //     const errors = validationResult(req)
    //     console.log(errors)
       
    //   if(!errors.isEmpty())
    // {
    //     return  res.render('create',{errors:errors['errors']})
     
    // }
    //   return next();
}

exports.loginvalid=[
    body('username','UserName should be Enter').notEmpty(),
    body('password','Password should be Require').notEmpty()
]

exports.loginresult=async(req,res,next)=>{
    // const errors = validationResult(req)
    // console.log(errors)
    // if(!errors.isEmpty())
    // {
    //  return  res.render('home',{errors:errors['errors']})
     
    // }
    // return next()
}

// exports.validupdate=[
//     body('name','Name should be required').notEmpty(),
//     body('username','UserName should be Unique').notEmpty(),
//     body('password').custom(async (password,{req})=>
//     {
        
//         if(password!='' && password.length < 5)
//         {
//             throw new Error('password length must be 5 or more')
//         }
//     })
// ]

// exports.updateResult=async(req,res,next)=>{
    
//     const errors = validationResult(req)
//     console.log(errors)
//     const user = {id:req.params.id,
//         name:req.body.name,
//         username:req.body.uname
//     }
    
//     if(!errors.isEmpty())
//     {
//         return  res.render('edit',{errors:errors['errors'],user})
     
//     }
//     return next()
// }
