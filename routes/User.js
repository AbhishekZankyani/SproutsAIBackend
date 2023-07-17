const express = require('express')
const router = express.Router()
const {getUsers,addUser,getUserById,updateUser,deleteUser,login} = require('../Controller/UserController')

router.route('/Users').get(getUsers).post(addUser)

router.route('/Users/:id').get(getUserById).put(updateUser).delete(deleteUser)

router.route('/login').post(login)
module.exports = router