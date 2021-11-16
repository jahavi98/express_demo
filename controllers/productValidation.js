const { body,validationResult } = require('express-validator');

exports.validateproduct = [
    body('name','Product name should more than 3 character').isLength({min:2}),
    body('pnumber','Product SKU must be unique').isLength({min:5}),
    body('description','Product Description must be required').isLength({min:50}),
    body('price','Price should more than 1 digit').isLength({min:1}),
]

exports.result = async(req,res,next)=>
{
        const errors = validationResult(req)
        console.log(errors)
        if(!errors.isEmpty())
        {
            return  res.render('products',{title:'Product page',errors:errors['errors']})
        }
        return next();
}


// exports.editresult = async(req,res,next)=>
//     {
//             const errors = validationResult(req)
//             console.log(errors)
//             if(!errors.isEmpty())
//             {
//                 const product = {
//                     id:req.params,
//                     name:req.body.name,
//                     pnumber:req.body.pnumber,
//                     description:req.body.description,
//                     price:req.body.price
//                 }
            
//                 return  res.render('pedit',{title:'Product edit page',errors:errors['errors'],product})
//             }
//             return next();
//     }