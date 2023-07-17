const RolesModel = require('../Models/RolesModel')
//@desc Get all Roles
//@route GET /Roles
//@access public 
const getRoles =  async(req,res)=>{
    try{
        const roles = await RolesModel.find()
        if(!roles)
        {
            res.status(404).json({"message":"Roles Not Found"})
        }
        res.status(201).json(roles)
    }
    catch(err){
        res.status(404).json({"message":err.toString()})
    }
    // res.status(200).json({"message":"Get All Roles"})
} 

//@desc Add New Role
//@route POST /Roles
//@access public 
const addRole = async(req,res)=>{
    try{
        const role = req.body.RoleName
        if(!role)
        {
            res.status(404).json({"message":"Role Name is mandotary"})
        }
        const newRole = new RolesModel({
            RoleName:role
        })
        const op = await newRole.save()
        res.status(201).json({"message":"User Added Sucessfully",
    "output":op})
    }
    catch(err){
        res.status(404).json({"message":err.toString()})
    }
    // res.status(200).json({"message":"Get All Roles"})
} 

module.exports = {getRoles,addRole}