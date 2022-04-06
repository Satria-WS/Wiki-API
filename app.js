//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

//templating using ejs
app.set("view engine", "ejs");
//body-parer in onrder to pass our request
app.use(bodyParser.urlencoded({ extended: true }));
//going to use the public directory to store out static files such as images css code
app.use(express.static("public"));
//Connect to mongodb
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true});
//create db articleSchema
const articleSchema = {
    title:"String",
    content:"String"
};

//The last part set up our app to listen on port 3000
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
