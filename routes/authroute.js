const express = require("express");
const { login, register } = require("../Controllers/userAuthentication");
const isAuthenticated = require('../middleware/auth')


const authRouter = express.Router();
authRouter
  .post("/register", async (req, res) => await register(req, res))
  .post("/login", async (req, res) => await login(req, res))
  
  module.exports = authRouter;