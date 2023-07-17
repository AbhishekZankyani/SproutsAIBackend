const UserModel = require('../Models/UserModel')
const RolesModel = require('../Models/RolesModel')
const bcrypt = require('bcrypt');
const TaskModel = require('../Models/TaskModel');
const saltRounds = 10;
const jwt = require('jsonwebtoken')
const secret = "SproutsAI"



//@desc Get all Users
//@route GET /Users
//@access public 
const getUsers = async(req,res)=>{
        try{
            const users = await UserModel.find().populate({path:"UserRole",module:TaskModel})
            if(!users)
            {
                res.status(404).json({"message":"users Not Found"})
            }
            res.status(201).json(users)
        }
        catch(err){
            res.status(404).json({"message":err.toString()})
        }
    // res.status(200).json({"message":"Get All Users"})
} 

//@desc Add a User
//@route Post /Users
//@access public 
const createPassword = async (Password) => {
    return await new Promise((resolve, reject) => {
      bcrypt.hash(Password, saltRounds, function(err, hash) {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  };
  

  const checkPassword = async (Password, storedPassword) => {
    try {
      const result = await bcrypt.compare(Password, storedPassword);
      return result;
    } catch (err) {
      // Handle the error
      console.error('Error comparing passwords:', err);
      return false;
    }
  };
  

const checkUserRole =async(Role)=>{
    const check = await RolesModel.findById(Role)
    if(!check){
        return false
    }
    else return true
}

const getUserRole =async(id)=>{
    const check = await RolesModel.findById(id)
    return check.RoleName
}

const addUser = async (req, res) => {
    try {
      const { FirstName, LastName, Password, Phone, Email } = req.body;
      const userRole ='64b25873b66820871f6882e7'
      if (!FirstName || !LastName || !Phone || !Email || !Password) {
        return res.status(404).json({"message":"All Fields are Mandatory"});
      }
      var checkEmail = await UserModel.findOne({ Email: Email })
      if(checkEmail)
      {
        return res.status(400).json({"message":"Email Already Exist"});
      }
      if (!(await checkUserRole(userRole))) {
        return res.status(404).json("Invalid Role");
      }
      const hashedPassword = await createPassword(Password); // Await the hashed password
      const user = new UserModel({
        FirstName: FirstName,
        LastName: LastName,
        Password: hashedPassword, // Store the hashed password in the UserModel
        Phone: Phone,
        Email: Email,
        UserRole: userRole,
      });
      const op = await user.save();
      res.status(200).json({ "message":"User SucessFully Created","data":op  });
    } catch (err) {
      res.status(404).json({ message: err.toString() });
    }
  };
  

//@desc Get User by Id
//@route GET /Users/id
//@access public 
const getUserById =(req,res)=>{
    res.status(200).json({"message" : `Get By Id API ${req.params.id}`})
}

//@desc Update User
//@route PUT /Users/id
//@access public 
const updateUser = (req,res)=>{
    res.status(200).json({"message" : `Put API ${req.params.id}`})
}

//@desc Delete User
//@route Delete /Users/id
//@access public 
const deleteUser = (req,res)=>{
    res.status(200).json({"message" : `Delete By Id API ${req.params.id}`})
}

//@desc Login User
// @route Login /Login
const login = async (req, res) => {
    try {
      const data = await UserModel.findOne({ Email: req.body.Email.toLowerCase() }).populate({ path: "UserRole", module: TaskModel });
      if (!data) {
        res.status(404).json({ "message": "Invalid User Email" });
      } else {
        const passwordMatched = await checkPassword(req.body.Password, data.Password);
        if (!passwordMatched) {
          res.status(404).json({ "message": "Invalid Password" });
        } else {
            jwt.sign({user:data},secret,(err,token)=>{
                res.status(201).json({"message":"User Login Sucessful",
                "body":token});
            })
        }
      }
    } catch (err) {
      res.status(404).json({ "message": err.toString() });
    }
  };
  
module.exports = {getUsers,addUser,getUserById,updateUser,deleteUser,login}