const { body,validationResult } = require('express-validator');

exports.validateproduct = [
    body('name','Product name should be more than 3 character').isLength({min:2}),
    body('pnumber','Product SKU must be required').notEmpty(),
    body('description','Product Description must be required').notEmpty(),
    body('price','Price should more than 1 digit').isLength({min:1}),
]

exports.result = async(req,res,next)=>
{
        // const errors = validationResult(req)
        // console.log(errors)
        // if(errors)
        // {
        //     return  res.render('pcreate',{title:'Product page',errors:errors['errors']})
        // }
        // return next();
}


