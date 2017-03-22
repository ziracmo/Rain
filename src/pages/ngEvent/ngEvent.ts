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

  /**
   * Create the new event
   */
  create() {

    // For the moment it just display a toast which last 2 sec

    // Set the toast properties
    let toast = this.toastCtrl.create({
      message: 'Event was added successfully',
      duration: 2000,
      position: 'bottom'
    });

    // When the toast is dismiss it log it
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    // Display the toast
    toast.present();

    // Go the last view
    this.dismiss()
  }
  
  /**
   * Return to the last view
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }
}

/**
 * The class Event
 */
class Event {
  name: string = '';
  sport: string = '';
  date: any;
  duration: any;
  missing: string = '0';
  address: string = '';
  city: string = ''
}
