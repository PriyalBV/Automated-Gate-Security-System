const express = require('express');
const router = express.Router();
const { registerParent, loginParent } = require('../controllers/parentController');



router.post('/register', registerParent);
router.post('/login', loginParent); 
module.exports = router;
