var express = require('express');
var path = require('path');
var router = express.Router();

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


const cookieParser = require('cookie-parser');
var app = express();

var viewPath = path.join(__dirname, '/../views');

app.set('view engine', 'ejs');
app.set('views', viewPath);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
//static path
app.use(express.static(__dirname + '/../assets/css'));
app.use(express.static('../assets'))


//connect to MongoDB
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/LibraryDB');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected")
    // we're connected!
});

//use sessions for tracking logins
app.use(session({
    secret: "AmanIsCrazy",
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    }),
    cookie: {
        expires: 600000
    }

}));


app.use((req, res, next) => {
    res.locals.username = req.session.username
    next();
});



// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        console.log('inside sessionchecker'+ req.session.user)
        res.render('index', { username: req.session.user.username });
    } else {
        next();
    }
};

var ssn ;
var User = require('../models/user.model.js');
var Item = require('../models/item.model.js');
var UserItem = require('../models/UserItem.js');


// ######### SIGN-UP #################
app.get('/signup', function (req, res) {
    res.render('signup');
});

app.post('/signup', function (req, res) {

  if (req.body.email && req.body.username && req.body.password ) 
    {
        var userData = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        address1: req.body.add1,
        address2: req.body.add2,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        country: req.body.country
                
        }

        User.create(userData, function (error, user,next) {
        if (error) {
            return next(error);
        } else 
        {
           req.session.userId = user._id;
           ssn= req.session;
           ssn.username=req.body.username;
            return res.render('index', { username: ssn.username });
        }
        });
    }
    else{
        res.render('signup', { message: "Please enter all fields" });
    }
});

    // User.filter(function (user) {
    //         if (user.username === req.body.username) {
    //             res.render('signup', { message: "User Already Exists! Login or choose another user id" });
    //         }
    //     }

app.get('/', function (req, res) {
    ssn= req.session;
    // console.log(req.session.user);
    if (ssn.username) {
        // redirect it to login page
        console.log(ssn.username)
        res.render('index', { username: ssn.username });
    } else {
        // do something
        res.redirect('/login');
    }
});


app.get('/logout', function (req, res) {
    req.session.destroy(function () {
        console.log("user logged out.")
    });
    // req.logout();
    res.redirect('/');
});

// app.get('/index', function (req, res) {
//     res.render('index');
// });

// ######### LOGIN #################
app.route('/login')
.get(sessionChecker,(req, res) =>{
    res.render('login');
})

.post((req, res,next) =>
    {
    if (req.body.username && req.body.password) {
        User.authenticate(req.body.username, req.body.password, function (error, user) {
            if (error || !user) {
                var err = new Error('Wrong username or password.');
                err.status = 401;
                return res.render('login', {message: "Invalid credentials!"});
            } else {
                ssn= req.session;
                ssn.username=req.body.username;
                ssn.userId = user._id;
                ssn.user =user;
                return res.render('index', { username: req.body.username });
            }
        });
    }
    else {
    var err = new Error('All fields requlired.');
    err.status = 400;
    return next(err);
        }
});

app.get('/myprofile', function(req, res, next) {

    var username = ssn.username;
    User.find({ 'username': username }).then((results) => {
        res.render('myprofile', { title: 'profile', user: results[0] });
    });
    
});

app.post('/update',function(req,res){

    var updateData = {
        
        address1: req.body.add1,
        address2: req.body.add2,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        country: req.body.country
                
        }
    // var user = ssn.user;
    console.log(req.session.username)
    User.findOneAndUpdate({ 'username': req.session.username}, { $set: updateData }, {upsert:true}, function(err, doc){
    if (err) return res.send(500, { error: err });
    console.log("succesfully saved");
        res.render('index', { username: req.session.username})
});
    // User.insertOne({ 'username': user.username }, { $set: updateData } )
    // res.render('index', { username: ssn.username })
});


app.get('/about', function (req, res) {
    res.render('about');
})

app.get('/contactUs', function (req, res) {
    res.render('contactUs');
});


app.get('/myitems', function (req, res, next) {
    ssn = req.session
    UserItem.find({username:ssn.username,}).then((results)=>{
    res.render('myitems', { bookdet:  results});
});
});


app.get('/savemyitems/:itemCode', function (req, res) {
    var itemcode = (req.params.itemCode);
    ssn= req.session
    var itemselected;
    mess="Please login first" 
    console.log(itemcode)
     Item.find({itemCode:itemcode}).then((results)=>{
        itemselected = results;
        // Creating useritem data object
        var useritemData = new UserItem({
        _id : itemcode + ssn.username,
        itemCode: itemcode,
        itemName: itemselected[0].itemName,
        subCategory: itemselected[0].subCategory,
        username:ssn.username,
        rating:itemselected[0].rating
        })
        console.log(useritemData)
        // Creating UserItem and inserting 
         useritemData.save(function (err) { if (err) console.log('Error on save!') });
         if (typeof ssn.username == 'undefined'){
             mess
             return res.render('login',{ message: mess })
         }
         return res.render('index', { username: ssn.username });
        // }
        });

    });


app.get('/deletemyitems/:itemCode', function (req, res) {
    var itemcode = (req.params.itemCode);
    ssn =req.session
    console.log(ssn.username)
    console.log('Deleting item Feature' + itemcode)
   UserItem.remove({itemCode: itemcode, username:ssn.username}, function(err, result) {
            if (err) {
                console.log(err);
            }
            console.log(result);
            // db.close();
       });
    res.redirect('/myitems')

});


app.post('/savefeeback', function (req, res) {
    feedback = req.body.feedback
    console.log(feedback)
    const fs = require('fs');
    fs.appendFile(path.join(__dirname, "temp", "feed.txt"), "\n" + feedback, function (err) {
        if (err) {
            console.log("append failed")
        } else {
            console.log("file saved successfully")
            req.flash('Review', "Submitted Successfully")
        }
    })
    res.redirect(req.get('referer'));
})



app.get('/item', function (req, res) {
    res.render('item');
});


app.get('/categories', function (req, res) {
        var filter = { subCategory: ['Inspirational', 'Learning'] }
        Item.find(filter).then((itemsdata1) => {
        res.render('categories', {
          cat1 : filter.subCategory,
          data1 : itemsdata1
        });
      }, (e) => {
        res.status(400).send(e);
      });
      
});


app.get('/categories/:subCategory/item/:itemCode', function (req, res) {
    var itemc = (req.params.itemCode);
    var subCategory = (req.params.subCategory);
    var filter = { subCategory: subCategory, itemCode: itemc}
    Item.find(filter).then((item) => {
        res.render('item', {
          id: itemc, item: item[0]
        });
      }, (e) => {
        res.status(400).send(e);
      });

});



app.listen(8080, function () {
    console.log("Listening on port 8080")
});

module.exports = router;

