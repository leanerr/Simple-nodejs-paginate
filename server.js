// initialize express framework
var express = require("express");
var app = express();
 
// create http server
var http = require("http").createServer(app);
 
/// include mongo DB module
var mongodb = require("mongodb");
var mongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectId;

// set the view engine as EJS for displaying HTML files
app.set("view engine", "ejs");
// start the server
http.listen(3000, function () {
    console.log("Server started at port 3000");
    // connect with mongo DB server and database
    mongoClient.connect("mongodb://localhost:27017", {
        useUnifiedTopology: true
    }, function (error, client) {
        var database = client.db("pagination_nodejs_mongodb");
        console.log("Database connected.");
        // create a GET HTTP route
app.get("/", async function (request, result) {
 
    // number of records you want to show per page
    var perPage = 2;
 
    // total number of records from database
    var total = await database.collection("users").count();
    //console.log(total)
    // Calculating number of pagination links required
    var pages = Math.ceil(total / perPage);
 
    // get current page number
    var pageNumber = (request.query.page == null) ? 1 : request.query.page;
 
    // get records to skip
    var startFrom = (pageNumber - 1) * perPage;
 
    // get data from mongo DB using pagination
    var users = await database.collection("users").find({})
        .sort({ "id": -1 })
        .skip(startFrom)
        .limit(perPage)
        .toArray();
 
    // render an HTML page with number of pages, and users data
    result.render("index", {
        "pages": pages,
        "users": users
    });
});
});
});