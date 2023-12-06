const User = require("../Models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Step 8: Fields for Signup
exports.register = async (req, res) => 
 {

  
 
    try {
      //get all data from body
    const { fullname, email, password, age, gender, mobile } = req.body;
   
     if(!(fullname && email && password && age && gender && mobile )){
      res.status(400).send("all fields are mandetory")
     }
  
     //check if user already existes
     const existingUser= await User.findOne({email})
     if(existingUser){
      rs.status(401).send("user already exist")
     }
     // Hash the password using bcrypt
     //ie we encrypt the password here
        const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  
    //save the user in db
    const newUser = await User.create({
        fullname,
        email,
        password: hashedPassword,
        age,
        gender,
        mobile,
      });
      await newUser.save();
  
   
  
      
      const token = jwt.sign({ username: newUser.fullname }, process.env.JWT_SECRET_KEY, {
        expiresIn: 300,
      });
  
      newUser.token= token
      newUser.password= undefined
      res.status(201).json({
        message: "User registered successfully",
        token: token,
      });
    
  
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: "Internal server error" });
    }
  };