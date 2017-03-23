import {Injectable} from "@angular/core";
/**
 * Created by Alexandre on 23/03/2017.
 */

// Our global variable which will serve the events for each pages
@Injectable()
export class GlobalEvents {

  events;

  constructor() {
    this.events = [];
  }

  /**
   * Set our global events
   * @param value our new events
   */
  setEvents(value) {
    this.events = value;
  }

  /**
   * Return all the events
   * @returns {any} the events
   */
  getEvents() {
    return this.events;
  }

}
