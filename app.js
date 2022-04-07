//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

//templating using ejs
app.set("view engine", "ejs");
//body-parer in onrder to pass our request
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
//going to use the public directory to store out static files such as images css code
app.use(express.static("public"));
//Connect to mongodb
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
});
//create db articleSchema
const articleSchema = {
  title: "String",
  content: "String",
};
//crate model name
const Article = mongoose.model("Article", articleSchema);

//////////////////////////////////////////////Requests Targetting all Articles//////////////////////////////////////
//create chain route
app
  .route("/articles")
  .get((req, res) => {
    //syntax code: <ModelName>.find({conditions},function(err,results){//user the found results doct});;
    Article.find((err, foundArticles) => {
      //console.log(foundArticles);
      if (!err) {
        //res.send log to client
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (err) {
      if (!err) {
        res.send("Run Successfully add a new article");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Sucessfull deleted all articles");
      } else {
        res.send(err);
      }
    });
  });

//////////////////////////////////////////////Requests Targetting all Articles//////////////////////////////////////

//How to dealing route parameters with specific article
//read specific article
app
  .route("/articles/:articlesTitle")
  .get((req, res) => {
    Article.findOne(
      { title: req.params.articlesTitle },
      (err, foundSpecificArticles) => {
        if (foundSpecificArticles) {
          res.send(foundSpecificArticles);
        } else {
          res.send("Your article not found");
        }
      }
    );
  })
  //update specific article
  .put((req, res) => {
    Article.updateOne(
      { title: req.params.articlesTitle },
      { title: req.body.title, content: req.body.content },
      function (err) {
        if (!err) {
          res.send("Successfully updated article");
        }
      }
    );
  })
  //patch specific article
  .patch((req, res) => {
    Article.update(
      { title: req.params.articlesTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Successfull updated article");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articlesTitle }, 
    (err) => {
      if (!err) {
        res.end("Successfully deleted the corresponding article");
      } else {
          res.send(err);
      }
    });
  });

//Get routes, Fetches all the entire collection of articles
app.get("/articles");

//Post routes for creates one new article
app.post("/articles");

//Delete routes
app.delete("/articles");

//The last part set up our app to listen on port 3000
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
