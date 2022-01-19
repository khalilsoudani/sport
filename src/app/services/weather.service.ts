import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  weatherURL : string = "http://localhost:3000/weathers";

  constructor(private httpClient: HttpClient) { }

  sendReqToSearchWeather(cityObj) {
    return this.httpClient.get<{ result: any }>(`${this.weatherURL}/search/${JSON.stringify(cityObj)}`);
  }
  
  sendReqToAddWeather(weatherObj) {
    return this.httpClient.post<{ result: any }>(this.weatherURL, weatherObj);
  }

}
