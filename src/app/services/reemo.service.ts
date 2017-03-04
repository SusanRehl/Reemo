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
  //  return JSON.parse(data);
  var data = JSON.parse(JSON.parse(data._body));
    let finalJson = "";
    for(var i=0; i<data.length; i++){
      let dataItem = data[i];
      finalJson += dataItem["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
    }

    console.log(finalJson);

    let finalJsonData = JSON.parse(finalJson);

    console.log(finalJsonData);

    var rtn = new ReemoData();

    // TODO - loop through finalJsonData
    // for each loop, determine what type it is.
    // new up a new class (sleep, step or heart (which you need to define below))
    // add that new instance to the rtn instance.

    return rtn;
  }
}

export class ReemoData {
  SleepData: ReemoSleep[];
  StepData: ReemoStep[];
  HeartData: ReemoHeart[];
}
