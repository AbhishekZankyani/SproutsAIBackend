const express = require("express");
const router = express.Router();
const {
  createTask,
  getAllTasks,
  getAllTasksAssignByMe,
  updateTasks,
  updateTaskStatus,
} = require("../Controller/TaskCOntroller");

router.route("/").post(createTask).get(getAllTasks);
router.route("/:id").put(updateTaskStatus);
router.route("/byMe").get(getAllTasksAssignByMe);

module.exports = router;
