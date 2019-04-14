//------ DATABASE INITIALIZATION-------///

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/LibraryDB', { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});

var Schema = mongoose.Schema;

let ItemSchema = new Schema({
    itemCode: {type: String, required: true,unique:true, max: 100},
    itemName: {type: String, required: true, max: 100},
    subCategory: {type: String, required: true, max: 100},
    Description:{type: String, required: true, max:200 },
    rating:{type: Number , required: true},
    imageUrl:{type: String, required: true, max: 100},
});


var Item = mongoose.model('Item', ItemSchema);
var db = mongoose.connection; 
db.once('open', function () {
    console.log("Connection Successful!");

//     // documents array
var books = [{
      itemCode:'IL1',
      itemName:'Deep Work',
      subCategory:'Inspirational',
      Description: 'Deep work is a inspirational book in a deeply distracted world. Most people looses the ability to go deep and think pragmatically as what will be good for them to be successful in this globally competitive world. Cultivating a habit of deep work is beneficial in what we do, which in turn produces better results in less time.',
      rating:4/5,
      imageUrl:'/images/deep_work.jpg',
    },
    {
      itemCode:'IL2',
      itemName:'Grit',
      subCategory:'Inspirational',
    Description:'Research indicates that the ability to be gritty—to stick with things that are important to you and bounce back from failure—is an essential component of success independent of and beyond what talent and intelligence contribute .',
      rating: 4/5,
      imageUrl:'/images/Grit.jpg',
      },
      {
        itemCode:'IL3',
        itemName:'Dream Big',
        subCategory:'Inspirational',
      Description:'Being a big dreamer does not mean that you walk around with your head in the clouds. It means that you are seeking a purpose for your life and it means that you are becoming fulfilled in the process. People that get into the habit of dreaming big will accomplish those goals because they have the right mindset.',
          rating: 4 / 5,
        imageUrl:'/images/Dream_Big.jpg',
        },
		{
      itemCode:'IL4',
      itemName:'HTML5 Way to make websites',
      subCategory:'Learning',
    Description:'HTML 5 is a revision of the Hypertext Markup Language (HTML), the standard programming language for describing the contents and appearance of Web pages.HTML5 was developed to solve compatibility problems that affect the current standard, HTML4..',
            rating: 4 / 5,
      imageUrl:'/images/HTML5.jpg',
      },
      {
        itemCode:'IL5',
        itemName:'Java script The good parts',
        subCategory:'Learning',
        Description:"JavaScript is most commonly used as a client side scripting language. This means that JavaScript code is written into an HTML page. When a user requests an HTML page with JavaScript in it, the script is sent to the browser and it's up to the browser to do something with it..",
          rating: 4 / 5,
        imageUrl:'/images/Javascript.jpg',
        },
        {
          itemCode:'IL6',
          itemName:'Let US C',
          subCategory:'Learning',
        Description:'For C language programmers, it is must to master the complexity of the language to deal with programming software in engineering, gaming and other fields. In order to understand each concept of the C language, it is necessary to follow a good reference book in easy-to-understand text.',
            rating: 4 / 5,
          imageUrl:'/images/Let_Us_C.jpg',
          }];

    // save multiple documents to the collection 
    Item.insertMany(books, function (err, docs) {
        if (err) {
            return console.error(err);
        } else {
            console.log("Multiple documents inserted to Collection");
            db.close();
        }
    });

});

// -------------- RESET DATABASE---------------------------//
//When resetting the database comment the code above //
// Uncomment the below code to reset and destroy the database

// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/LibraryDB', { useNewUrlParser: true }, (err) => {
//     if (!err) { console.log('MongoDB Connection Succeeded.') }
//     else { console.log('Error in DB connection : ' + err) }
// });

// var db = mongoose.connection; 
// db.dropDatabase();
// // db.disconnect();

