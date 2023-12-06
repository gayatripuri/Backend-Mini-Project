const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());


app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.set("view engine", "ejs");


const { register } = require("./Controllers/userAuthentication");
//middleware
//next is a method when we add next it means hey proceed with next part
const isLoggedIn = (req, res, next) => {
  let loggedIn = true;
  if (loggedIn) {
    next();
  } else {
    res.json({
      status: "fail",
      msg: "user not loggined in",
    });
  }
};

//public api
app.get("/", (req, res) => {
  res.send("all good");
});

//private api
app.get("/health", isLoggedIn, async (req, res) => {
  try {
    const serverName = "Your Week List Server";

    const currentTime = new Date().toLocaleString();
    const serverState = "active";

    res.json({
      serverName,
      currentTime,
      serverState,
    });
  } catch (error) {
    res.json({
      status: "fail",
      msg: "user not loggined in",
    });
  }
});




// Step 7: Implement Login using Email and Password
app.post("/login", async (req, res) => {
 

  try {
//get data from body
    const { email, password } = req.body;

    if(!( email && password  )){
      res.status(201).send("fill both mail and password")
     }
  
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY);
     
      user.token= token
      user.password= undefined
      res.status(201).send("success")
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});





app.post("/register", register);





// Route not found middleware
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(process.env.PORT, () => {
  mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Server running on localhost:" + process.env.PORT);
  })
  .catch((error) => console.error(error));
});


