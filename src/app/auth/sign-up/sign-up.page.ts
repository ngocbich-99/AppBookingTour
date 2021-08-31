import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  formSignUp: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.formSignUp = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(6)]
      })
    })
  }
  onSignUp(){
    console.log(this.formSignUp.value);
    this.authService.addUser(this.formSignUp.value.email, this.formSignUp.value.password)
    .subscribe(() => {
      this.showToast('Tạo tài khoản thành công!', 'success');
      this.router.navigate(['/auth']);
      this.formSignUp.reset();
    })
  }
  //Show toast
  private showToast(meseage: string, color: string) {
    this.toastCtrl
      .create({
        message: meseage,
        color: color,
        duration: 2000,
      })
      .then((toatEL) => toatEL.present());
  }
  onLogin() {
    this.router.navigate(['/auth']);
  }

}
