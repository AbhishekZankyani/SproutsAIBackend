const TaskModel = require("../Models/TaskModel");
const UserModel = require("../Models/UserModel");
// const UserModel = require("./Models/");
const jwt = require("jsonwebtoken");
const secret = "SproutsAI";

const checkUser = async (userId) => {
  const data = await UserModel.findById(userId);
  if (data) {
    return true;
  }
  return false;
};
const createTask = async (req, res) => {
  try {
    let data = null;
    jwt.verify(req.headers.authorization, secret, (err, authdata) => {
      if (err) {
        res.sendStatus(403);
      } else {
        console.log(authdata);
        data = authdata;
      }
    });
    console.log(data.user._id);
    const { TaskName, Deadline, AssignedTo } = req.body;
    if (!TaskName || !Deadline || !AssignedTo) {
      return res.status(404).json("All Feilds are Mandatory");
    }
    const AssignedBy = data.user._id;
    if (!(await checkUser(AssignedBy))) {
      return res.status(404).json("Invalid User");
    }
    if (!(await checkUser(AssignedTo))) {
      return res.status(404).json("No Such User");
    }

    const Task = new TaskModel({
      TaskName: TaskName,
      TaskStatus: "Pending",
      AssignedAt: Date.now(),
      AssignedBy: AssignedBy,
      AssignedTo: AssignedTo,
      Deadline: Deadline,
      CreatedAt: Date.now(),
    });
    const op = await Task.save();
    res.status(200).json({ message: op });
  } catch (err) {}
};

const getAllTasksAssignToMe = async (req, res) => {
  try {
    let data = null;
    jwt.verify(req.headers.authorization, secret, (err, authdata) => {
      if (err) {
        res.sendStatus(403);
      } else {
        console.log(authdata);
        data = authdata;
      }
    });
    console.log(data.user._id);
    const response = await TaskModel.find({
      AssignedTo: data.user._id,
    }).populate([
      { path: "AssignedTo", model: UserModel },
      { path: "AssignedBy", model: UserModel },
    ]);
    if (!response) {
      res.status(400).json({ message: "No Data Found" });
    }
    res.json(response);
  } catch (err) {
    res.status(404).json({ message: "Error Occured :" + err });
  }
};

const getAllTasksAssignByMe = async (req, res) => {
  try {
    let data = null;
    jwt.verify(req.headers.authorization, secret, (err, authdata) => {
      if (err) {
        res.sendStatus(403);
      } else {
        console.log(authdata);
        data = authdata;
      }
    });
    console.log(data.user._id);
    const response = await TaskModel.find({
      AssignedBy: data.user._id,
    }).populate([
      { path: "AssignedTo", model: UserModel },
      { path: "AssignedBy", model: UserModel },
    ]);
    if (!response) {
      res.status(400).json({ message: "No Data Found" });
    }
    res.json(response);
  } catch (err) {
    res.status(404).json({ message: "Error Occured :" + err });
  }
};

const getAllTasksByStatus = async (req, res) => {
  try {
    let data = null;
    jwt.verify(req.headers.authorization, secret, (err, authdata) => {
      if (err) {
        res.sendStatus(403);
      } else {
        console.log(authdata);
        data = authdata;
      }
    });
    console.log(data.user._id);
    const filter = req.params.id;
    const response = await TaskModel.find({
      AssignedBy: data.user._id,
      TaskStatus: filter,
    }).populate([
      { path: "AssignedTo", model: UserModel },
      { path: "AssignedBy", model: UserModel },
    ]);
    if (!response) {
      res.status(400).json({ message: "No Data Found" });
    }
    res.json(response);
  } catch (err) {
    res.status(404).json({ message: "Error Occured :" + err });
  }
};

const updateTasks = async (req, res) => {
  try {
    // Fetch tasks with crossed deadline
    const tasks = await TaskModel.find();
    for (let task of tasks) {
      if (
        new Date(task.Deadline).getDate() - new Date().getDate() < 0 &&
        task.TaskStatus != "Expired"
      ) {
        task.TaskStatus = "Expired";
        await task.save();
      }
    }
    //   res.status(200).json("Updated Successfully");
  } catch (error) {
    console.log(error);
    //   res.status(500).json("An error occurred");
  }
};

const updateTaskStatusById = async (req, res) => {
  try {
    console.log(req);
    if (!req.headers.authorization) {
      return res.sendStatus(403);
    }
    let data = null;
    jwt.verify(req.headers.authorization, secret, (err, authdata) => {
      if (err) {
        return res.sendStatus(403);
      } else {
        console.log(authdata);
        data = authdata;
      }
    });
    console.log(data.user._id);
    const taskId = req.params.id;
    if (!taskId) {
      return res.status(400).json({ message: "Task Id is Required" });
    }
    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(400).json({ message: "Invalid Task Id" });
    }
    if (task.AssignedTo != data.user._id) {
      return res.status(401).json({ message: "User Not Allowed to Update" });
    }
    if (task.TaskStatus == "Pending") {
      task.TaskStatus = "Completed";
      await task.save();
    } else {
      return res
        .status(400)
        .json({ message: "Cannot Update Expired or Completed Task" });
    }
    return res.status(200).json({ message: "Updated Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json("An error occurred");
  }
};

module.exports = {
  createTask,
  getAllTasks: getAllTasksAssignToMe,
  getAllTasksAssignByMe,
  updateTasks,
  updateTaskStatus: updateTaskStatusById,
};
