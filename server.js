const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");

//db config
const { MONGO_URI } = require("./config/keys");
//Db connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("mongodb connected successfully"))
  .catch((err) => console.error("mongo connection failed"));

//models requiring
//const user = require("./models/User");
//pulling routes
const users = require("./routes/api/users");

const app = express();

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Passport middleware
app.use(passport.initialize());

//Passport config
require("./config/passport")(passport);

//Routes config
app.use("/api/users", users);

//port mapping
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server up and running on the port: ${port}`);
});
