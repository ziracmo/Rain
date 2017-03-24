import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {FacebookAuth, User} from "@ionic/cloud-angular";
import {TabsPage} from "../tabs/tabs";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController, public facebookAuth: FacebookAuth, public user: User) {
  }

  login() {
    console.log('[INFO] Trying to login on Facebook')
    this.facebookAuth.login().then(()=> {
      console.log('plop')
      this.navCtrl.push(TabsPage);
    });
  }

  logout() {
    this.facebookAuth.logout().then(res => {

    })
  }

}
