const {body,validationResult} = require('express-validator');

exports.validateuser = [
    body('name','Name should be more than 5 character').isLength({min:5}),
    body('username','User Name should be more than 5 character').isLength({min:5}),
    body('password','Password should be more than 8 character').isLength({min:5}),
]


exports.result = async(req,res,next)=>
{
        const errors = validationResult(req)
        console.log(errors)
        if(!errors.isEmpty())
        {
            
            return  res.render('users',{title:'my page',errors:errors['errors']})
        }
        return next();
    }
exports.loginvalid = [
    body('username','User Name should be more than 5 character').isLength({min:5}),
    body('password','Password should be more than 5 character').isLength({min:5})
]

exports.loginresult = async(req,res,next)=>{
    const errors = validationResult(req)
    console.log(errors)
    if(!errors.isEmpty())
    {
     return  res.render('home',{title:'my page',errors:errors['errors']})
     
    }
    return next();
}

// exports.validupdate = [
//     body('name','Name should be more than 5 character').isLength({min:5}),
//     body('username','User Name should be more than 5 character').isLength({min:5}),
// ]

// exports.updateResult = async(req,res,next)=>{
    
//     const errors = validationResult(req)
//     console.log(errors)
//     const user = {id:req.params,
//         name:req.body.name,
//         username:req.body.username
//     }
    
//     if(!errors.isEmpty())
//     {
//         return  res.render('edit',{title:'my page',errors:errors['errors'],user})
     
//     }
//     return next()
// }
