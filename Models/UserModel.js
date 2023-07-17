const mongoose = require('mongoose')
const RolesModel = require('./RolesModel')


const UserModel = mongoose.Schema({
    FirstName:{
        type:String,
        require:true
    },
    LastName:{
        type:String,
        require:true
    },
    Password:{
        type:String,
        require:true
    },
    Phone:{
        type:String,
        require:true
    },
    Email:{
        type:String,
        require:true
    },
    UserRole: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: RolesModel
    },
    // UserRole:{
    //     type:Id,
    //     require:true
    // },

})

module.exports = mongoose.model('User',UserModel)