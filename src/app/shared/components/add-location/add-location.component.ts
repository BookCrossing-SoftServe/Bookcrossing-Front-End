import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
      city: new FormControl(null, Validators.required),
      street: new FormControl(null, Validators.required),
      officeName: new FormControl(null, Validators.required),
      room: new FormControl(null, Validators.required)
    });
  }

onSubmit(){
  ;
}

}
