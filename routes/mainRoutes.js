module.exports = (function() {
    'use strict'; //ensures that undeclared variables etc are not used

    var mainRoutes = require('express').Router();

    mainRoutes.get('/', function(req, res) {
        res.send("route!!");
    });

    return mainRoutes;
})();