const mongoose =require ('mongoose');
const productSchema = new mongoose.Schema({
	
	productname: {
		type: String,
		required: true,
	},
	
	categoryname: {
		type: String,
		required: true,
	},
	


	categoryid: {
		type: Number,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	
	
});
 module.exports = mongoose.model('Product', productSchema);

