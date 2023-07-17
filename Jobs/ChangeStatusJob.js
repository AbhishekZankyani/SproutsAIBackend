var cron = require('node-cron');
const {createTask,getAllTasks,updateTasks} = require("../Controller/TaskCOntroller")

var task = cron.schedule('* * * * *', () =>  {
  try{
    updateTasks()
  }catch(err){console.log(err)}

}, {
  scheduled: false
});

task.start();
module.exports = task