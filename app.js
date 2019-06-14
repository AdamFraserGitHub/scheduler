//imports
const express = require('express');
const app = express();
const ip = require('ip');
const bodyParser = require('body-parser');

//custom modules
const fileHandling = require("./server functions/fileHandling.js")

//routes
const mainRoutes = require('./routes/mainRoutes')

//middleware
app.use('/', mainRoutes);
app.use('/', express.static('public'));
app.use(bodyParser.json()); //allows basic post params to be recieved
app.use(bodyParser.urlencoded({extended: true})); //supports application/x-www-form-urlencoded, the defualt post encoding

//TODO move ajax handlers to external file
app.post('/addTask', function(req, res) {
    fileHandling.addTask(req.body);
    res.sendStatus(200);
});

app.post('/getDaySchedule', function(req, res) {
    daySchedule = fileHandling.getDaySchedule(req.body.date);
    if(!daySchedule) {
        res.send("fnf")
    } else {
        res.send(JSON.stringify(daySchedule));
    }
});

app.post('/removeTask', function(req, res) {
    success = fileHandling.removeTask(req.body.taskID, req.body.date,req.body.fit);

    if(success) {
        res.send("ok");
    } else {
        res.send("not ok")
    }
});

app.post('/clearFile', function(req, res) {
    fileHandling.clearFile(req.body.scheduleDate);
    res.send(200);
});

//run server
// app.listen(80, ip.address(), function() {
//     //TODO add more verbose server logging
//     console.log("server online!")
// });

app.listen(80, "localhost", function() {
    //TODO add more verbose server logging
    console.log("server online!")
});