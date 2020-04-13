import { Component, OnInit } from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {NotificationService} from "../../../../core/services/notification/notification.service";
import {TranslateService} from "@ngx-translate/core";
//import {AuthService} from "../../../core/auth/auth.service";

@Component({
  selector: "app-email-conf",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"]
})
export class ForgotPasswordComponent implements OnInit {
  constructor(
    private notificationService: NotificationService,
    private translate: TranslateService,
    //private authService: AuthService,
    private fb: FormBuilder
  ) {}

  forgotPasswordForm = this.fb.group({
    Email: [
      "",
      [Validators.required, Validators.email]
    ],
  });

  // onSubmit() {
  //   this.authService.forgotPassword(this.forgotPasswordForm.value.Email).subscribe(() => {
  //     this.notificationService.success(this.translate
  //       .instant("components.account.password-forgot.success"));
  //   }, err => {
  //     this.notificationService.warn(this.translate
  //       .instant("components.account.password-forgot.error"));
  //   });
  // }

  ngOnInit(): void {
  }
}
