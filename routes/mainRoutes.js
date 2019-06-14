const path = require('path')

module.exports = (function() {
    'use strict'; //ensures that undeclared variables etc are not used

    var mainRoutes = require('express').Router();

    mainRoutes.get('/v1', function(req, res) {
        res.sendFile(path.join(__dirname, '../pages/v1.html'))
    });

    mainRoutes.get('/newSchedule', function(req, res) {
        res.sendFile(path.join(__dirname, '../pages/createSchedule.html'));
    });

    return mainRoutes;
})();