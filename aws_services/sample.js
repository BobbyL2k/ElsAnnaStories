
var AWS = require('aws-sdk');
var bl = require('bl');
var s3 = new AWS.S3();
var fs = require('fs');
var job = require('cron').CronJob;
var http = new require('https');
//Predefined rules read from policy.json
var policy = fs.readFileSync('./policy.json');
console.log("Prepared Policy:\n"+policy.toString());
//Amazon storage folder
var bucketName = "elsa-cdn"
//Target Spreadsheetname;
var keyName = 'BabySteps.js';
var targetSpreadsheet = "https://docs.google.com/spreadsheets/d/1tdM3N69BU_o3hv5OpmMLrJw5MhGBLv1bF70-1YI1754/pubhtml?gid=1636285301&single=true";
var newSpreadsheetData = "";

new job("* 30 * * * *",function(){
  console.log("Fetching new spreadsheet.");
  getNewSpreadsheet(function(err,getNewSuccess){
    if(getNewSuccess){
      console.log("Uploading...");
      uploadNewSpreadsheet(function(err,uploadSuccess){
        console.log("Upload completed---");
      });
    }
  });

},null,true);
getSpreadsheet();

/////getNewSpreadsheet();
//Checking amazon file storage service for anonymous read access.

s3.getBucketPolicy(params = {Bucket:"elsa-cdn"}, function(err,data){
  if(err){
    //The rule hadn't been defined.
    if(err.code=='NoSuchBucketPolicy'){
      s3.putBucketPolicy({
        Bucket:bucketName,
        Policy:policy.toString()
      },function(err,data){
        if(err)
        console.log("Policy creation error.\n" +err);
        else
        console.log("Policy empty.\nNew policy created");
        getSpreadsheet();
      });
    }
  }
  else{
    console.log("Current Policy:\n"+JSON.stringify(data));
  }
});

//Get current Spreadsheet that exist on S3 Server to newSpreadsheetData
function getSpreadsheet()
{
  var link = "https://s3.amazonaws.com/" + bucketName + "/" +keyName ;
  http.get(link,function(res){
    if(res.statusCode=='200'){
      res.pipe(bl(function(err,data){
        console.log("Current spreadsheet: (Displaying first 100 char)");
        console.log(data.toString().substring(0,100)+"\n\n");
        newSpreadsheetData = data.toString();
      }));
    }
    else if (res.statusCode=='403'){
      console.log("File forbidden");
    }
    res.on('error',function(e){
      console.log(e);
    });
  });
}

//Get new spreadsheet from GoogleDoc
function getNewSpreadsheet(callback){
  var link = targetSpreadsheet;
  http.get(link,function(res){
    if(res.statusCode=='200'){
      res.pipe(bl(function(err,data){
        console.log("Target spreadsheet acquired: (Displaying first 100 char)")
        console.log(data.toString().substring(0,100) + "\n\n");
        newSpreadsheetData = data;
        callback(null,true);
      }));
    }
    else{
      console.log("Acquiring target spreadsheet failed _ with code :" +
      res.statusCode);
      callback("ERROR",false);
    }
    res.on('error',function(err){
      console.log(err);
      callback(err,false)
    });
  });

}

function uploadNewSpreadsheet(callback){
  if(newSpreadsheetData != ""){
    s3.putObject({Bucket:bucketName,Key:keyName,Body:newSpreadsheetData},
    function(err,data){
      if(err) callback(err);
      else {
        callback(null,true);
      }
    });
  }
}
