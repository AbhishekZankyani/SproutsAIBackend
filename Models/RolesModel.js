const mongoose = require('mongoose')

const RolesModel= new mongoose.Schema({
    RoleName:{
        type:String,
        require:true
    }
})
 module.exports = mongoose.model('Roles',RolesModel)