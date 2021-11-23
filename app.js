//jshint esversion:6
require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb+srv://danielremete:Mongodb01@gettingstarted.zd1xl.mongodb.net/userDB?retryWrites=true&w=majority")

const userSchema = new mongoose.Schema (
  // ez már nem csak egy sima javascript object, hanem ez a egy mongoose schema lett, oje
{
  email: String,
  password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']} );
// ezt még a schema létrehozása előtt kell megadni
// ez az encrypt pulgin automatice bekódolja a jelszót  aháttérben, ha a save() parancsot látja
//és a find() parancsnál meg feloldja, hogy pl tudja ellenőrizni a  jelszót

const User = new mongoose.model("User", userSchema);

app.get("/", function(req,res){
  res.render("home")
});

app.get("/login", function(req,res){
  res.render("login")
});

app.get("/register", function(req,res){
  res.render("register")
});

app.post("/register", function(req,res){
const newUser = new User({
  email: req.body.username,
  password: req.body.password
})
newUser.save(function(err){
  if (err) {
    console.log(err);
  } else { res.render("secrets")}
})

});


app.post("/login", function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if (err) {console.log(err);}
    else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets")
        }
      }
    }
  })

})



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
