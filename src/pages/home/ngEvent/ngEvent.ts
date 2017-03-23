/**
 * Created by Alexandre on 21/03/2017.
 */

import {Component} from "@angular/core";
import {Platform, NavParams, ViewController, ToastController} from "ionic-angular";
import * as _ from 'lodash';
import {GlobalEvents} from "../../../app/providers/events";
import {Database} from "@ionic/cloud-angular";

@Component({
  templateUrl: './ngEvent.html'
})
export class ngEvent {

  event: Event;

  constructor(public platform: Platform,
              public params: NavParams,
              public viewCtrl: ViewController,
              private toastCtrl: ToastController,
              public events: GlobalEvents,
              public db: Database) {
    this.event = new Event();
    console.log(events)
  }

  /**
   * Create the new event
   */
  create() {
    // For the moment it just display a toast which last 2 sec
    if (!this.checkMissingParameters()) {
      // Set the toast properties
      let toast = this.toastCtrl.create({
        message: 'Event was added successfully',
        duration: 2000,
        position: 'top'
      });

      this.sendEvent(this.event)

      // Display the toast
      toast.present();

      // Go the last view
      this.dismiss()
    } else {
      // Set the toast properties
      let toast = this.toastCtrl.create({
        message: 'There is some missing arguments',
        duration: 3000,
        position: 'top'
      });
      // Display the toast
      toast.present();
    }
  }

  /**
   * Return to the last view
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }

  checkMissingParameters(): boolean {
    let event = this.event;
    return (event.date == undefined
    || event.begin == undefined
    || _.replace(event.address, ' ', '') == ''
    || _.replace(event.city, ' ', '') == ''
    || _.replace(event.sport, ' ', '') == '')
  }

  sendEvent(event: Event) {
    this.db.collection('events').store(event);
  }
}

/**
 * The class Event
 */
class Event {
  sport: string = '';
  date: any;
  begin: any;
  duration: any;
  missing: string = '0';
  address: string = '';
  city: string = ''
}
