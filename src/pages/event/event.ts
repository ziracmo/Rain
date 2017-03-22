import {Component} from '@angular/core';

import {NavController} from 'ionic-angular';
import {EventDescriptionPage} from "./event-description/event-description";

@Component({
  selector: 'page-about',
  templateUrl: 'event.html'
})
export class EventPage {

  events = [
    {
      sport: 'Football',
      distance: 0.5
    }, {
      sport: 'Handball',
      distance: 2.1
    }, {
      sport: 'Basketball',
      distance: 2.5
    }, {
      sport: 'Running',
      distance: 5.8
    }, {
      sport: 'Football',
      distance: 6.0
    }, {
      sport: 'Handball',
      distance: 6.2
    }, {
      sport: 'Basketball',
      distance: 6.5
    }, {
      sport: 'Running',
      distance: 7.3
    }, {
      sport: 'Football',
      distance: 7.8
    },
  ]

  constructor(public nav: NavController) {

  }

  openDetailsPage(event){
    this.nav.push(EventDescriptionPage, { event: event });
  }

}
