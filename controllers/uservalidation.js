const {body,validationResult} = require('express-validator');

exports.validateuser = [
    body('name','Name should be more than 5 character').isLength({min:5}),
    body('username','UserName should be Unique').isLength({min:4}),
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