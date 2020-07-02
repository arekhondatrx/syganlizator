const express = require('express');
const router = express.Router();

router.get('/state/:state', function(req, res) {
    const state = req.params.state;
    res.send(state);
    console.log(`Aktualny stan: ${state}`);
});

module.exports = router;