import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  weatherForm: FormGroup;

  constructor(private formBuilder : FormBuilder, private weatherService : WeatherService) { }

  ngOnInit(): void {

    this.weatherForm = this.formBuilder.group({
      
    })
  }

}
