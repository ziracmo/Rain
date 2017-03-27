import {Component} from '@angular/core';
import {Events, Platform} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {TabsPage} from "../pages/tabs/tabs";
import {GlobalEvents} from "./providers/events";
import {UserData} from "./providers/user";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = TabsPage;
  events;

  constructor(platform: Platform,public appEvents: Events, public globalEvents: GlobalEvents, public user: UserData) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Init the Ui component
      StatusBar.styleDefault();
      Splashscreen.hide();
    });

    // When a event are updated
    this.appEvents.subscribe('event:update', () => {
      console.log('[INFO] Calculating the distance to the events')
      this.events = this.globalEvents.getEvents();
      for(let event of this.events) {
        event.distance = this.getDistanceFromLatLonInKm(
          this.user.getPosition().latitude,
          this.user.getPosition().longitude,
          event.position.latitude,
          event.position.longitude
        )
      }
    });

  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  getDistanceFromLatLonInKm(latitudeOne, longitudeOne, latitudeTwo, longitudeTwo) {
    let earthRadius = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(latitudeTwo-latitudeOne);  // deg2rad below
    let dLon = this.deg2rad(longitudeTwo-longitudeOne);
    let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(this.deg2rad(latitudeOne)) * Math.cos(this.deg2rad(latitudeTwo)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = earthRadius * c; // Distance in km
    return Math.round(d);
  }
}
