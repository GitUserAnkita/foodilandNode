var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var morgan = require('morgan')
var mongoose = require('mongoose')
const request = require("request");
const axios = require('axios')
const Instagram = require("instagram-web-api");
require('dotenv').config();

var db = require('./config/dbConfig');
db();


var app = express()

var port = process.env.PORT

const instBaseUrl = process.env.INSTA_BASE_URL;
const userId = process.env.USER_ID;
const AccessToken = process.env.LONG_ACCESS_TOKEN;
const { username, password } = process.env;
const client = new Instagram({ username, password });

app.use(cors());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(morgan('combined'))


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).send("working fine")
})

require('./route/role')(app)
require('./route/user')(app)
require('./route/category')(app)
require('./route/recipe')(app)
require('./route/blog')(app)
require('./route/recipe_meta')(app)
require('./route/siteOption')(app)
require('./route/subscribeEmail')(app)
require('./route/contact')(app)
require('./route/instagram')(app)

app.listen(port, () => {
  console.log(`server is ready to port ${port}`)
})

module.exports = app