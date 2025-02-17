const express = require('express');
const { getUsers } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', verifyToken, getUsers);

module.exports = router;

