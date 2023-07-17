const express = require('express')
const route = express.Router()
const {getRoles,addRole} = require('../Controller/RolesController')

route.route('/').get(getRoles).post(addRole)

module.exports = route