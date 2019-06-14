
function addTask(taskName, type, startTime, endTime, duration, scheduleDate) {
    //expects dates to be formated in usual js manner    

    var valid = true;
    //first three checks allow for scheduling by duration or start and end time or both
    //the third allows duration to be ommitted
    if(!scheduleDate && !startTime && !endTime) {
        alert("you have not provided a start time, end time or a date!")
        valid = false;
    } else if(!startTime && !endTime && duration == undefined ) {
        alert("you've not entered a start time, an end time or a duration");
        valid = false
    } else if(!startTime && !endTime && duration != undefined && scheduleDate) {
        //allows to just add on to end of day
        startTime = "auto";
        endTime = "auto";
    } else if(!endTime && duration != undefined) {
        endTime = new Date(startTime)
        endTime.setTime(endTime.getTime() + (duration.hours*60 + duration.mins)*60*1000);
    } else if(!startTime && duration) {
        console.log("what the shimmering fuck")
        startTime = new Date(endTime)
        startTime.setTime(startTime.getTime() - (duration.hours*60 + duration.mins)*60*1000);
    }

    console.log(startTime);
    console.log(endTime)
    //preform checks (client side but hi ho i'm the only one using this)

    var checkDurationHour, checkDurationMin;
    if(startTime + endTime != "autoauto") {
        checkDurationHour = Math.floor((endTime - startTime) / 1000 / 60 / 60);
        checkDurationMin = (endTime - startTime) / 1000 / 60 - (checkDurationHour * 60);
    } else {
        console.log("huh")
        checkDurationHour = duration.hours;
        checkDurationMin = duration.mins;
    }

    console.log(checkDurationHour);
    console.log(checkDurationMin);
    
    if(duration == undefined && startTime && endTime) {
        duration = {
            hours: checkDurationHour,
            mins: checkDurationMin
        }
    }
    

    if(endTime >= startTime && duration.hours == checkDurationHour && duration.mins == checkDurationMin && valid){
        //generate a timestamp
        var timestamp = new Date();
        timestamp = timestamp.getTime();

        if(!scheduleDate) {
            // scheduleDate = String(startTime.getDate()) + "-" + String(startTime.getMonth()) + "-" + String(startTime.getFullYear());
            scheduleDate = startTime;
        }

        //post data to server
        $.ajax({
            type: "POST",
            url: "/addTask",
            data: {
                taskName: taskName,
                type: type,
                startTime: startTime,
                endTime: endTime,
                duration: duration,
                timestamp: timestamp,
                scheduleDate: scheduleDate
            },
            
            success: function(response) {
                if(response != "OK") {
                    console.log("failed to post task to server!, code: " + response)
                    alert("failed to post task to server!")
                }
            }
        });

    } else {
        alert("there was an error with your start time, end time or duration");
    }
}

function getDaySchedule(date, callback) {
    //expects a date in (*shudders intensly*) us formatting

    $.ajax({
        type: "POST",
        url: "/getDaySchedule",
        data: {
            date: date
        },

        success: function(response) {
            if(response == "fnf") {
                alert("sorry a schedule file for " + date + " was not found");
                callback(false);
            } else {
                callback(JSON.parse(response));
            }
        }
    })
}

function consolePrintSchedule(date) {
    getDaySchedule(date, consolePrintScheduleDataRecieved);
}

function consolePrintScheduleDataRecieved(rawData) {
    if(rawData) {
        rawData = rawData.fileData;
        var printTable = []

        printTable.push([]);
        printTable[0] = ["task", "type", "start time", "end time", "duration"]
        for(var i = 0; i < rawData.length; i++) {
            var startT = new Date(rawData[i].start);
            console.log(startT.getHours());
            startT = String(startT.getHours()) + ":" + String(startT.getMinutes());

            var endT = new Date(rawData[i].end);
            endT = String(endT.getHours()) + ":" + String(endT.getMinutes());

            var duration = String(rawData[i].duration.hours) + ":" + String(rawData[i].duration.mins);

            printTable.push([]);
            printTable[i + 1].push(rawData[i].name);
            printTable[i + 1].push(rawData[i].type);
            printTable[i + 1].push(startT);
            printTable[i + 1].push(endT);
            printTable[i + 1].push(duration);
        }

        console.table(printTable);
    }
} 

function addRandomTing() {
	var taskName = String(Math.random());
	var startTime = new Date("2019-05-31T12:00");
	var endTime = new Date("2019-05-31T14:00");
	var duration = {
		hours: 2,
		mins: 0	
	};
	var type = "good";

	addTask(taskName, type, startTime, endTime, duration);
}

function removeTask(taskID, date, fit) {
    $.ajax({
        type: "POST",
        url: "/removeTask",
        data: {
            taskID: taskID,
            fit: fit,
            date: date
        },

        success: function(response) {
            if(response == "not ok") {
                alert("sorry could not find that task on this date to delete it, maybe try reloading?")
            }
        }
    })
} 


