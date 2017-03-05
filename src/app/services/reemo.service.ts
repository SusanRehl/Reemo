import { Component, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';

@Injectable()
export class ReemoService {
  constructor (private http: Http)  {

  }

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

    // TODO - loop through finalJsonData
    // for each loop, determine what type it is.
    // new up a new class (sleep, step or heart (which you need to define below))
    // add that new instance to the rtn instance.

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

  //     console.log(stepData);
  //     console.log(heartRateData);
  //     console.log(sleepData);

     rtn.SleepData = sleepData;
     rtn.HeartRateData = heartRateData;
     rtn.StepData = stepData;



    return rtn;
  }
}

export class ReemoData {
  SleepData;
  StepData;
  HeartRateData;
}
