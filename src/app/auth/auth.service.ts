import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  statusLogin = new Subject<string>();
  userAccount = new Subject<string>();
  userAccStr: string;

  constructor(private http: HttpClient) {}

  addUser(email: string, password: string){
    const user = {
      email: email,
      password: password,
    }
    return this.http.post('https://booking-app-d0398-default-rtdb.firebaseio.com/users.json',user)
    .pipe(
      tap(resData => {
        console.log(resData);
      })
    );
  }

  login(email: string, password: string) {
    let mess = '';
    return this.http.get('https://booking-app-d0398-default-rtdb.firebaseio.com/users.json')
    .subscribe (res => {
      for (const key in res) {
        
        if (res.hasOwnProperty(key)) {
          if(res[key].email === email && res[key].password === password) {
            mess = 'login success';
            this.storeUser(res[key].email);
            this.getUserStore();
            break;
          } else {
            mess = 'login error'
          }
        }
      };
      if (mess === 'login success') {
        this.statusLogin.next('login success');
      } else {
        this.statusLogin.next('login error');
      }
    }, error => {
      console.log(error);
    });
  }
  private storeUser(email: string){
    Plugins.Storage.set({key: 'userAccount', value: email});
  }
  public getUserStore(){
    Plugins.Storage.get({key: 'userAccount'}).then(resData => {
      this.userAccount.next(resData.value);
      this.userAccStr = resData.value;
    });
  }
}
