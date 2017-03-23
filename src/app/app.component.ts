import {Component} from '@angular/core';
import {Events, Platform} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';

import {TabsPage} from '../pages/tabs/tabs';
import {Database} from "@ionic/cloud-angular";
import {GlobalEvents} from "./providers/events";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = TabsPage;

  constructor(platform: Platform,
              public db: Database,
              public events: GlobalEvents,
              public appEvents: Events) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.

      console.log('[INFO] Connecting to the DB');
      // Connect to the DB to get the events
      this.db.connect();

      // get the events collection
      this.db.collection('events').watch().subscribe(
        (dbEvent) => {
          console.log();
          this.events.setEvents(dbEvent);
          console.log('[INFO] Getting events : ',this.events.getEvents());
          this.appEvents.publish('event:update')
        }, (error) => {
          console.error('[ERROR] Getting events : ',error.message);
        });

      // Init the Ui component
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
