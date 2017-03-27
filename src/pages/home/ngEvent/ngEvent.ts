/**
 * Created by Alexandre on 21/03/2017.
 */

import {Component} from "@angular/core";
import {Platform, NavParams, ViewController, ToastController, Events} from "ionic-angular";
import * as _ from 'lodash';
import {GlobalEvents} from "../../../app/providers/events";
import {Database} from "@ionic/cloud-angular";
import {SportEvent} from "../model/sport-event";

declare var google;

@Component({
  templateUrl: './ngEvent.html'
})
export class ngEvent {

  event: SportEvent;

  constructor(public platform: Platform,
              public params: NavParams,
              public viewCtrl: ViewController,
              private toastCtrl: ToastController,
              public events: GlobalEvents,
              public db: Database,
              public appEvents: Events) {
    this.event = new SportEvent();
  }

  /**
   * Create the new event
   */
  create() {
    // For the moment it just display a toast which last 2 sec
    if (!this.checkMissingParameters()) {

      let address = this.event.position.address + ' ' + this.event.position.city;
      this.getPositionFromAddress(address).then((res: Coordonates) => {
        // Setting the position get with the google api
        this.event.position.latitude = res.latitude;
        this.event.position.longitude = res.longitude;
        // Then send the event to the DB
        this.sendEvent(this.event)
        // Then publish an event for the app
        this.appEvents.publish('event:created', this.event, Date.now());
      }).catch((err) => {
        // When an error occures it log it to the user
        console.log('[ERROR] : No result found')
        this.createToast('No Result found for this adress', 'top', 200)
      })
      this.createToast('The event is currently being added', 'top', 3000)
      // Go to the last view
      this.dismiss()
    } else {
      this.createToast('There is some missing argument', 'top', 3000)
    }
  }

  /**
   * Return to the last view
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }

  /**
   * Check if the events has all his content fill
   * @returns {boolean} true if there is some missing character and false if it's not
   */
  checkMissingParameters(): boolean {
    let event = this.event;
    return (event.date == undefined
    || event.begin == undefined
    || _.replace(event.position.address, ' ', '') == ''
    || _.replace(event.position.city, ' ', '') == ''
    || _.replace(event.sport, ' ', '') == '')
  }

  /**
   * Add the event in the DB
   * @param event the event to add
   */
  sendEvent(event: SportEvent) {
    this.db.collection('events').store(event);
  }

  /**
   * create a toast to the user
   * @param text the text to display
   * @param position the position where the toast will be display (top, center, bottom)
   * @param duration the duration of the toast in ms
   */
  createToast(text: string, position: string, duration: number) {
    // Set the toast properties
    let toast = this.toastCtrl.create({
      message: text,
      duration: duration,
      position: position
    });
    // Display the toast
    toast.present();
  }

  /**
   * Get the longitude and the latitude from the address given
   * @param address the adress to find the coordonates
   * @returns {Promise<T>} when we have a response we resolve or reject a response
   */
  getPositionFromAddress(address: string) {
    let geocoder = new google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      // Getting the coordonates for the marker from the string
      geocoder.geocode({'address': address}, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          let latitude = results[0].geometry.location.lat();
          let longitude = results[0].geometry.location.lng();
          resolve({
            latitude: latitude,
            longitude: longitude
          })
        } else {
          reject(status)
        }
      })
    })

  }
}



class Coordonates {
  latitude: '';
  longitude: '';
}
