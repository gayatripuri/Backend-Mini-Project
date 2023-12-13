const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());

const authRouter = require("./routes/authroute");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set view engine
app.set("view engine", "ejs");

// Public API
app.get("/", (req, res) => {
  res.send("all good");
});

// Private API
app.get("/health", async (req, res) => {
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
      msg: "user not logged in",
    });
  }
});


// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log("Server running on localhost:" + process.env.PORT);
    });
  })
  .catch((error) => console.error(error));

// Auth routes
app.use("/", authRouter);



// Route not found middleware
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});
// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: "Something went wrong! Please try again later." });
});
