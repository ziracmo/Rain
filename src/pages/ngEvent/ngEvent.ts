/**
 * Created by Alexandre on 21/03/2017.
 */

import {Component} from "@angular/core";
import {Platform, NavParams, ViewController, ToastController} from "ionic-angular";


@Component({
  templateUrl: './ngEvent.html'
})
export class ngEvent {

  event: Event;

  constructor(public platform: Platform,
              public params: NavParams,
              public viewCtrl: ViewController,
              private toastCtrl: ToastController) {
    this.event = new Event();
  }

  create() {
    let toast = this.toastCtrl.create({
      message: 'Event was added successfully',
      duration: 2000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
    this.dismiss()
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}

class Event {

  name: string = '';
  sport: string = '';
  date: any;
  duration: any;
  missing: string = '0';
  address: string = '';
  city: string = ''
}
