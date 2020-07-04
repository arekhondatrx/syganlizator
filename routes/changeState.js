'use strict';

const express = require('express');
const router = express.Router();
const stateHandler = require('../handlers/changeState');

router.get('/state/:state', stateHandler);

module.exports = router;