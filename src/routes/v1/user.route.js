const express = require('express');
const controller = require('../../controllers/user.controller');

const router = express.Router();

router.param('userId', controller.get);
