import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { IAuthor } from "src/app/core/models/author";
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-author-form',
  templateUrl: './author-form.component.html',
  styleUrls: ['./author-form.component.scss']
})
export class AuthorFormComponent implements OnInit {

@Output() onAction : EventEmitter<IAuthor> = new EventEmitter<IAuthor>()
@Output() onCancel : EventEmitter<void> = new EventEmitter<void>()
@Input() author : IAuthor
form: FormGroup

  constructor() { }

  ngOnInit(): void {
    this.form = new FormGroup({
      id: new FormControl({value: this.author.id,disabled: true}),
      firstName : new FormControl(this.author.firstName),
      lastName : new FormControl(this.author.lastName),
      middleName : new FormControl(this.author.middleName)
    });
  }

  submit(): void {
    const newAuthor: IAuthor = {
      id: this.form.get('id').value,
      firstName: this.form.get('firstName').value,
      lastName: this.form.get('lastName').value,
      middleName: this.form.get('middleName').value
    };
    this.onAction.emit(newAuthor);
    this.cancel();
  };

  cancel(): void {
    this.onCancel.emit();
  }
}
