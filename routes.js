const express=require("express");
const router = express.Router();
const Product = require ('../models/product');
const multer = require ('multer');
const fs=require("fs");
const product = require("../models/product");

// image upload
var storage = multer.diskStorage({
destination:function(req,file,cb){
    cb(null,'./uploads');
},
filename:function(req,file,cb){
cb(null,file.fieldname+"_"+Date.now())
},
});
var upload = multer({
    storage:storage,
}).single("image");

//insert product in database
router.post('/add',upload,(req,res)=>{
const product = new Product({
         productname:req.body.productname,
         categoryname:req.body.categoryname,
         categoryid:req.body.categoryid,
         image:req.file.filename,

});
product.save((err) => {
if (err){

    res.json({message:err.message,type:"danger"});
}else{
req.session.message={
    type:"success",
    message:"Product added successfully!",
};
res.redirect("/");
}

});

});
//get all products route
router.get("/",(req,res)=> {
Product.find().exec((err,Product) =>{
    if(err){
        res.json({message:err.message});
    }else{
        res.render("index",{
            tittle:"Home Page",
            Product:Product,
        });
    }
});

});

router.get("/add",(req,res)=> {
    res.render("add_products",{tittle:"Add Products"});

});

// edit an product route
router.get("/edit/:id",(req,res)=>{
let id = req.params.id;
Product.findById(id,(err,Product)=>{
if(err){

    res.redirect("/");
}else{
    if (Product==null){
        res.redirect("/");
    }else{
        res.render("edit_products",{
            tittle:"Edit Products",
            Product:Product,
});

}
}
});

});
//update product route
router.post('/upload/:id',upload,(req,res)=>{
let id=req.params.id;
let new_image='';
if (req.file){
    new_image=req.file
    try{
        fs.unlinkSync('./uploads/'+req.body.old_image);
}catch(err){
    console.log(err);
}
}else{
    new_image=req.body.old_image;
}
Product.findByIdAndUpdate(id, {
        Productname : req.body.Productname,
        categoryname :req.body.categoryname,
        categoryid : req.body.categoryid,
        image: req.file.filename,
} ,(err,result)=>{
if(err){
    res.json({message:err.message,type:'danger'});
}else {
    req.session.message={
type:'success',
message:'Product updated succesfully!'

    };
    res.redirect("/");
}
})  
});
//delete Product
router.get('/delete/:id',(req,res)=>{
    let id =req.params.id;
    Product.findByIdAndRemove(id, (err, result) =>{
        if(result.image !=''){
            try{
                fs.unlinkSync('./uploads/+result.image');
            }catch(err){
                console.log(err);
            }
        }
        if(err){
        res.json({message:err.message});
    }else{
        req.session.message ={
            type:'info',
            message:'Product deleted successfully!',
        };
        res.redirect("/");
    }

    });
})
module.exports = router;
