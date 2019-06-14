const fs = require('fs');
const path = require('path');

var dataPath = path.join(__dirname, "../data");


exports.addTask = function(postData) {
    console.log(postData);
    postData.scheduleDate = new Date(postData.scheduleDate); //converts from string to date
 
    //if start and end date are auto then just tag it on to the end using duration
    //assumes that the day you are adding to is provided in the data
    if(postData.startTime == "auto" && postData.endTime == "auto") {
        //TODO yeah we movin to a db boi
        console.log("date1")
        console.log(postData.scheduleDate);
        var filename = path.join(dataPath, String(postData.scheduleDate.getDate()) + "-" + String(postData.scheduleDate.getMonth() + 1) + "-" + String(postData.scheduleDate.getFullYear()) + ".csv");
        //TODO what if there is no file?
        console.log(filename);
        var fileData = fs.readFileSync(filename).toString();
        fileData = fileData.split("\n");
        var lastEntry = fileData[fileData.length - 2]; //handles eof \n
        var lastEntryEndTime = new Date(lastEntry.split(",")[4]);
        postData.startTime = lastEntryEndTime;
        postData.endTime = new Date(postData.startTime);
        postData.endTime.setTime(postData.endTime.getTime() + (postData.duration.hours*60 + postData.duration.mins)*60*1000);
    }

    postData.endTime = new Date(postData.endTime);
    postData.startTime = new Date(postData.startTime);

    console.log(postData.endTime);
    console.log(postData.startTime);
    console.log(postData.scheduleDate);

    //get date for filename
    var startDateTime = new Date(postData.startTime);
    var fileName = String(startDateTime.getDate()) + "-" + String(startDateTime.getMonth() + 1) + "-" + String(startDateTime.getFullYear()) + ".csv";
    fileName = path.join(dataPath, fileName);
    console.log(fileName);

    var ID;
    if(!fs.existsSync(fileName)) {
        fs.writeFileSync(fileName, "1\n"); //initializes file with ID of 1 since 0 is being used by this task
        ID = "0";
    } else {
        ID = getID(fileName);
    }
    console.log(ID)

    var contents = ID + "," + postData.taskName + "," + postData.type + "," + postData.startTime + "," + postData.endTime + "," + postData.duration.hours + ":" + postData.duration.mins + "," + postData.timestamp + "\n";
    fs.appendFileSync(fileName, contents, function(err) {
        console.log("error writing to file")
    });
}

function getID(fileName) {
    //TODO dont read in the whole fucking file
    var fileData = fs.readFileSync(fileName).toString(); //reads file and converts from bytes to str

    var resaveFile = fileData.split("\n");
    console.log(resaveFile)
    resaveFile.splice(resaveFile.length - 1, 1); //removes newline at eof
    var ID = resaveFile[0];
    resaveFile[0] = String(Number(ID) + 1) + "\n";
    fs.writeFileSync(fileName, resaveFile[0]);
    for(var i = 1; i < resaveFile.length; i++) {
        fs.appendFileSync(fileName, resaveFile[i] + "\n");
    }

    return ID;
}

exports.getDaySchedule = function(date) {
    var fileName = path.join(dataPath, date + ".csv")

    if(!fs.existsSync(fileName)) {
        return false;
    } else {
        var fileData = fs.readFileSync(fileName).toString();

        fileData = fileData.split("\n");
        fileData.splice(0,1); //removes ID at start of array;
        fileData.splice(fileData.length - 1, 1); //removes \n at end of file

        for(var i = 0; i < fileData.length; i++) {
            fileData_i_Split = fileData[i].split(",");
            console.log(fileData_i_Split);
            fileData[i] = {
                ID: fileData_i_Split[0],
                name: fileData_i_Split[1],
                type: fileData_i_Split[2],
                start: fileData_i_Split[3],
                end: fileData_i_Split[4],
                duration: {
                    hours: fileData_i_Split[5].split(":")[0],
                    mins: fileData_i_Split[5].split(":")[1]
                }
            }
        }

        return {fileData: fileData};
    }
};

exports.removeTask = function(taskID, date, fit) {
    var fileName = path.join(dataPath, date + ".csv");

    if(!fs.existsSync(fileName)) {
        return false;
    } else {
        var fileData = fs.readFileSync(fileName).toString();

        fileData = fileData.split("\n");
        var workingTaskID = fileData.splice(0,1); //removes ID at start of array;
        fileData.splice(fileData.length - 1, 1); //removes \n at end of file

        //TODO
        //could switch to binary search
        var removeIndex = 0;
        for(var i = 0; i < fileData.length; i++) {
            if(fileData[i].split(",")[0] == taskID) {
                removeIndex = i;
                break;
            }
        }

        if(fit) {
            var shift = {
                hours: fileData[removeIndex].split(",")[5].split(':')[0],
                mins: fileData[removeIndex].split(",")[5].split(':')[1]
            }

            for(var i = removeIndex + 1; i < fileData.length; i++) {
                var currTaskSplit = fileData[i].split(',');
                var newStartDate = new Date(currTaskSplit[3]);
                var newEndDate = new Date(currTaskSplit[4]);

                newStartDate.setTime(newStartDate.getTime() - (shift.hours*60 + shift.mins)*60*1000);
                newEndDate.setTime(newEndDate.getTime() - (shift.hours*60 + shift.mins)*60*1000);

                newStartDate = String(newStartDate);
                newEndDate = String(newEndDate);

                currTaskSplit[3] = newStartDate;
                currTaskSplit[4] = newEndDate;

                fileData[i] = currTaskSplit.join();
            }
        

            fileData.splice(removeIndex, 1);
            fileData.splice(0,0,workingTaskID);
            fileData = fileData.join("\n");

            fs.writeFileSync(fileName, fileData)
            return true;
        }
             
    }
}

exports.clearFile = function(scheduleDate) {
    var scheduleDate = new Date(scheduleDate);
    var fileName = String(scheduleDate.getDate()) + "-" + String(scheduleDate.getMonth() + 1) + "-" + String(scheduleDate.getFullYear()) + ".csv";
    fileName = path.join(dataPath, fileName);

    if(fs.existsSync(fileName)) {
        fs.unlinkSync(fileName);
    }
}