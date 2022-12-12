require ("dotenv").config();
const express =require ("express");
const mongoose = require ("mongoose");
const session = require ("express-session");

const app = express ();
const PORT =process.env.PORT||5000;
//database connection

mongoose.connect(process.env.DB_uri,{useNewUrlParser : true , useUnifiedTopology:true});
const db =mongoose.connection;
db.on('error',(error)=> console.log(error));
db.once('open',()=> console.log('connected to the database'));

//middlewares
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(session({
secret:'my secret key',
saveUninitialized:true,
resave:false, 


})
);
app.use((req,res,next) => {
    res.locals.message=req.session.message;
    delete req.session.message;
next();
});
//making upload folder static
app.use(express.static("uploads"));

//set templete engine 
app.set("view engine","ejs");


app.use("", require ("./routes/routes"));


app.listen(PORT,()=>{
    console.log (`server started at http://localhost:${PORT}`);
});