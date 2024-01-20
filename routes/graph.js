const express = require('express');

const graphController = require('../controllers/graph');

const router = express.Router();


router.get('/', graphController.getIndex);

router.post('/submit', graphController.postSubmit);

module.exports = router;
