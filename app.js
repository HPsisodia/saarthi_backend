const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require('path');
const helmet = require("helmet");
const cookieParser = require('cookie-parser')

global.appRoot = path.resolve(__dirname);

// Logs Cache controlling Https
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(cookieParser())

// const static_path = path.join(__dirname, '/public/images');
// console.log(__dirname, '/views/images');
app.use(express.static('public'));
app.set("views", path.join(__dirname, "/public/views"));
app.set("view engine", "hbs");

const authRoute = require('./routes/auth');
// const clinicRoute = require('./routes/clinic');
const URLRoute = require('./routes/url');
const dashboardRoute = require('./routes/dashboard');

app.use("/", authRoute);
// app.use("/", clinicRoute);
app.use("/", URLRoute);
app.use("/", dashboardRoute);

app.use((req, res, next) => {
    res.status(404).render('404');
  });

const PORT = process.env.PORT || 3000;
const DBURL = process.env.DBURL ////add mongo database URI here

mongoose
  .connect(DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Application is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });  
