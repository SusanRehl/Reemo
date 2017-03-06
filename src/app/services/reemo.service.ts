import { Component, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';

@Injectable()
export class ReemoService {
  constructor (private http: Http)  {  }

  GetSeniorData() :Observable<ReemoData>{
      return this.http
        .get(`https://reemoazurefunctions.azurewebsites.net/api/ReemoJSONFromSQL_V2?code=RjOmG1zauttOw3KNdjeNIupqsV0yuI2SgLwVoXhClSzvtNuhYE9t4w==&name=db8abed9-2891-4504-a1fe-d0b3df567244`)
        //.map(r => r.json().data as ReemoData)
        .map(r => this.parseJson(r))
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
   }

  private parseJson(data: any){
    //Parse #1 and #2
    var data = JSON.parse(JSON.parse(data._body));
    let finalJson = "";

    for(var i=0; i<data.length; i++){
      let dataItem = data[i];
      finalJson += dataItem["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
    }

    // Parse #3
    let finalJsonData = JSON.parse(finalJson);
    console.log("third parse: ", finalJsonData);

    var rtn = new ReemoData();

    let stepData = [];
    let heartRateData = [];
    let sleepData = [];

    for(var j=0; j<finalJsonData.length; j++) {

          //PULLING STEP DATA FROM FINALJSONDATA
              stepData.push(finalJsonData[j].summary_data.stepcount);

          //PULLING SLEEP DATA FROM FINALJSONDATA
              if("sleep" in finalJsonData[j].summary_data) {
                 sleepData.push(finalJsonData[j].summary_data.sleep);
                }

          //PULLING HEARTRATE DATA FROM FINALJSONDATA
             if("heartrate" in finalJsonData[j].summary_data) {
                  heartRateData.push(finalJsonData[j].summary_data.heartrate);
                  }

       }  //end for loop

       //LOOP OVER SLEEPDATA ARRAY, CONVERT SLEEPTIMEINSECONDS TO HRS MINS THEN PUSH TO ARRAY AS NEW PROPERTY SLEEPTIME

       var sleeptime = function(data) {
           for(var k=0; k<data.length; k++) {
              var hours   = Math.floor(data[k].sleep_time_in_seconds / 3600);
              var minutes = Math.floor((data[k].sleep_time_in_seconds - (hours * 3600)) / 60);

              var sleep_time = {hours: hours, minutes: minutes};
              //  console.log("sleeptime: ", sleep_time);
                data[k].sleep_time = sleep_time;
             }
           }
           sleeptime(sleepData);

  //     console.log(stepData);
  //     console.log(heartRateData);
  //     console.log(sleepData);

     let lastAvgHeartRate = [];
     lastAvgHeartRate.push(heartRateData[heartRateData.length-1]);
//     console.log ("here's last avg heartrate: ", lastAvgHeartRate);

     let lastStepcount = [];
     lastStepcount.push(stepData[stepData.length-1]);
  //   console.log ("here's last stepcount: ", lastStepcount);

     let lastSleep = [];
     lastSleep.push(sleepData[sleepData.length-1]);
  // console.log ("here's last sleep: ", lastSleep);

//test message change  lastAvgHeartRate[0].average_heartrate = 200;

     console.log("last avg heartrate is: ", lastAvgHeartRate[0].average_heartrate);

        if(lastAvgHeartRate[0].average_heartrate < 60 || lastAvgHeartRate[0].average_heartrate > 100) {
              var indicator = 'priority_high';
               var message = "Heart rate is outside target range. Please follow up.";
        }  else  {
              var indicator = 'sentiment_satisfied';
            //  var colorclass = "tc-green-500 text-lg";
        }
        lastAvgHeartRate[0].indicator = indicator;
        lastAvgHeartRate[0].message = message;
  //      lastAvgHeartRate[0].colorclass = colorclass;

        console.log("new last avg heart rate array: ", lastAvgHeartRate);

// test message change     lastStepcount[0].total_stepcount = 50;
        if(lastStepcount[0].total_stepcount < 300) {
              var indicator = 'priority_high';
               var message = "Step count is below target range. Please follow up.";
        }  else  {
              var indicator = 'sentiment_satisfied';
            //  var colorclass = "tc-green-500 text-lg";
        }
        lastStepcount[0].indicator = indicator;
        lastStepcount[0].message = message;

  //test message change      lastSleep[0].sleep_time.hours = 3;

        if(lastSleep[0].sleep_time.hours < 6) {
              var indicator = 'priority_high';
               var message = "Sleep is below target range. Please follow up.";
               var colorclass = "tc-red-500 text-lg";
        }  else  {
              var indicator = 'sentiment_satisfied';
             var colorclass = "tc-green-500 text-lg";
        }
        lastSleep[0].indicator = indicator;
        lastSleep[0].message = message;




     rtn.SleepData = sleepData;
     rtn.HeartRateData = heartRateData;
     rtn.StepData = stepData;

     rtn.LastAvgHeartRate = lastAvgHeartRate;
     rtn.LastStepcount = lastStepcount;
     rtn.LastSleep = lastSleep;



    return rtn;
  }
}

export class ReemoData {
  SleepData;
  StepData;
  HeartRateData;
  LastAvgHeartRate;
  LastStepcount;
  LastSleep;
}
