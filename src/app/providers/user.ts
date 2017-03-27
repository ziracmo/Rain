/**
 * Created by Alexandre on 27/03/2017.
 */

import {Injectable} from "@angular/core";
/**
 * Created by Alexandre on 23/03/2017.
 */

// Our global variable which will serve the events for each pages
@Injectable()
export class UserData {

  position = {
    latitude: 1,
    longitude: 1
  }


  constructor() {}

  /**
   * Set our global user position
   * @param value our new user position
   */
  setPosition(position) {
    this.position = position;
  }

  /**
   * Return the user position
   * @returns {any} the use position
   */
  getPosition() {
    return this.position;
  }

}
