import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss']
})
export class AddLocationComponent implements OnInit {

  constructor() { }

  addLocationForm: FormGroup;

  ngOnInit(): void {
  this.buildForm();
  }

  buildForm() {
    this.addLocationForm = new FormGroup({
      
    };) 
  }

}
