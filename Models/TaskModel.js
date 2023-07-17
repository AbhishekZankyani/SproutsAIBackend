const mongoose = require('mongoose')
const UserModel = require('./UserModel')

const TaskModel = new mongoose.Schema({
    TaskName:{
        type:String,
        require:true
    },
    TaskStatus:{
        type:String,
        require:true
    },
    AssignedAt:{
        type:Date,
        require:true
    },
    CreatedAt:{
        type:Date,
        require:true
    },
    Deadline:{
        type:Date,
        require:true
    },
    AssignedTo:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: UserModel
    },
    AssignedBy:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: UserModel
    }

})

module.exports = mongoose.model('Task',TaskModel)