const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserItemSchema = new Schema({
        // _id: { type: String ,unique:true},
        itemCode: {type: String, required: true,max: 100},
        itemName: {type: String, required: true, max: 100},
        subCategory: {type: String, required: true, max: 100},
        username:{type: String, required: true,max:200 },
        rating:{type: Number, required: false},
});


// Export the model
 
var UserItem = mongoose.model('UserItem', UserItemSchema);
module.exports= UserItem;
