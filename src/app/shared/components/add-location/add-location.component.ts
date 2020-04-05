import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LocationService } from 'src/app/core/services/location/location.service';
import { ILocation } from 'src/app/core/models/location';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss']
})
export class AddLocationComponent implements OnInit {

  constructor(private locationService: LocationService) { }

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

onSubmit() {
  const room: number[] = [this.addLocationForm.get('room').value];
  const location: ILocation = {
    city: this.addLocationForm.get('city').value,
    street: this.addLocationForm.get('street').value,
    officeName: this.addLocationForm.get('officeName').value,
    rooms: room
  };
  this.locationService.postLocation(location).subscribe(
    (data: ILocation) => {
      alert('Successfully added');
    },
    error => {
      alert(error.message);
    }
  );

  this.addLocationForm.reset();
}

}
