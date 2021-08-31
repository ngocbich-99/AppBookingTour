import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;
  formLogin: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    this.formLogin = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(6)]
      })
    });
  }

  async onLogin() {
    const loadingCtrl = await this.loadingCtrl.create({
      keyboardClose: true,
      message: 'Đăng nhập...'
    });
    loadingCtrl.present();

    this.isLoading = true;
    this.authService.login(this.formLogin.value.email, this.formLogin.value.password);  
    this.authService.statusLogin.subscribe(res => {
      if (res === 'login success') {
        this.showToast('Đăng nhập thành công!','success');
        loadingCtrl.dismiss();
        this.router.navigateByUrl('/discover-places');
        this.formLogin.reset();
      } else {
        this.showToast('Tài khoản hoặc mật khẩu không đúng!','danger');
        loadingCtrl.dismiss();
      }
    })
  }

  private showToast(meseage: string, color: string) {
    this.toastCtrl
      .create({
        message: meseage,
        color: color,
        duration: 2000,
      })
      .then((toatEL) => toatEL.present());
  }
  onSwitchAuthMode() {
    this.router.navigateByUrl('/sign-up');
  }
}
