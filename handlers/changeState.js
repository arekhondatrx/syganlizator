'use strict';

module.exports = (req, res) => {
    const state = req.params.state;
    res.send(state);
    console.log(`Current state: ${state}`);
};