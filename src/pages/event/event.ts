import {Component} from '@angular/core';

import {Events, NavController} from 'ionic-angular';
import {EventDescriptionPage} from "./event-description/event-description";
import {GlobalEvents} from "../../app/providers/events";

@Component({
  selector: 'page-event',
  templateUrl: 'event.html'
})
export class EventPage {

  events;

  constructor(public nav: NavController,
              public globalEvents: GlobalEvents,
              public appEvent: Events) {

    this.events = this.globalEvents.getEvents();
    this.appEvent.subscribe('event:update', () => {
      this.events = this.globalEvents.getEvents();
    })
  }

  /**
   * Open the informations page for the event selected
   * @param event the event to display
   */
  openDetailsPage(event) {
    this.nav.push(EventDescriptionPage, {event: event});
  }

}
