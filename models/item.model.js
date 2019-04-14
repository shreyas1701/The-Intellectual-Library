const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ItemSchema = new Schema({
    itemCode: {type: String, required: true, max: 100},
    itemName: {type: String, required: true, max: 100},
    subCategory: {type: String, required: true, max: 100},
    Description:{type: String, required: true, max:200 },
    rating:{type: Number, required: true},
    imageUrl:{type: String, required: true, max: 100},
});


// Export the model
module.exports = mongoose.model('Item', ItemSchema);

