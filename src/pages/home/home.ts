import {Component, ElementRef, ViewChild} from '@angular/core';
import {Geolocation} from 'ionic-native';
import {Events, ModalController} from "ionic-angular";
import {ngEvent} from './ngEvent/ngEvent'
import {GlobalEvents} from "../../app/providers/events";
import {Database} from "@ionic/cloud-angular";
import {SportEvent} from "./model/sport-event";
import {UserData} from "../../app/providers/user";
import {lowerFirst} from 'lodash';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  mapStyle: any = [
    {
      "featureType": "administrative",
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#6195a0"}]
    }, {
      "featureType": "administrative.province",
      "elementType": "geometry.stroke",
      "stylers": [{"visibility": "off"}]
    }, {
      "featureType": "landscape",
      "elementType": "geometry",
      "stylers": [{"lightness": "0"}, {"saturation": "0"}, {"color": "#f5f5f2"}, {"gamma": "1"}]
    }, {
      "featureType": "landscape.man_made",
      "elementType": "all",
      "stylers": [{"lightness": "-3"}, {"gamma": "1.00"}]
    }, {
      "featureType": "landscape.natural.terrain",
      "elementType": "all",
      "stylers": [{"visibility": "off"}]
    }, {"featureType": "poi", "elementType": "all", "stylers": [{"visibility": "off"}]}, {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [{"color": "#bae5ce"}, {"visibility": "on"}]
    }, {
      "featureType": "road",
      "elementType": "all",
      "stylers": [{"saturation": -100}, {"lightness": 45}, {"visibility": "simplified"}]
    }, {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [{"visibility": "simplified"}]
    }, {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [{"color": "#fac9a9"}, {"visibility": "simplified"}]
    }, {
      "featureType": "road.highway",
      "elementType": "labels.text",
      "stylers": [{"color": "#4e4e4e"}]
    }, {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#787878"}]
    }, {
      "featureType": "road.arterial",
      "elementType": "labels.icon",
      "stylers": [{"visibility": "off"}]
    }, {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [{"visibility": "simplified"}]
    }, {
      "featureType": "transit.station.airport",
      "elementType": "labels.icon",
      "stylers": [{"hue": "#0a00ff"}, {"saturation": "-77"}, {"gamma": "0.57"}, {"lightness": "0"}]
    }, {
      "featureType": "transit.station.rail",
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#43321e"}]
    }, {
      "featureType": "transit.station.rail",
      "elementType": "labels.icon",
      "stylers": [{"hue": "#ff6c00"}, {"lightness": "4"}, {"gamma": "0.75"}, {"saturation": "-68"}]
    }, {
      "featureType": "water",
      "elementType": "all",
      "stylers": [{"color": "#eaf6f8"}, {"visibility": "on"}]
    }, {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [{"color": "#c7eced"}]
    }, {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{"lightness": "-49"}, {"saturation": "-53"}, {"gamma": "0.79"}]
    }]

  constructor(private modalCtrl: ModalController,
              public appEvents: Events,
              public db: Database,
              public events: GlobalEvents,
              public user: UserData) {
    // When a event is created
    this.appEvents.subscribe('event:created', (ngEvent, time) => {
      // Add our new event to our global env comming from the db
      this.events.setEvents(this.events.getEvents().push(ngEvent));

      // Then add a marker for it on the map
      this.addSportMarker({
        coords: {
          latitude: ngEvent.position.latitude,
          longitude: ngEvent.position.longitude
        }
      }, ngEvent)
    });

    this.appEvents.subscribe('event:update', () => {
      for (let event of this.events.getEvents()) {
        this.addSportMarker({
          coords: {
            longitude: event.position.longitude,
            latitude: event.position.latitude
          }
        }, event)
      }
    })
  }

  // When the view is loaded
  ionViewDidEnter() {
    console.log('[INFO] Connecting to the DB');
    // Connect to the DB to get the events
    this.db.connect();

    // get the events collection
    this.db.collection('events').watch().subscribe(
      (dbEvent) => {
        this.events.setEvents(dbEvent);
        console.log('[INFO] Getting events : ', this.events.getEvents());
        this.appEvents.publish('event:update')
      }, (error) => {
        console.error('[ERROR] Getting events : ', error.message);
      });

    // Then we load the map
    this.loadMap();
  }

  /**
   * Load the map to the user, center it to his position
   */
  loadMap() {
    console.log('[INFO] Loading The map')

    // Get the current user position
    Geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.user.setPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      })
      // Set the map option to center it to the user position
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
      }

      // Crete the map and apply the options
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.map.setOptions({styles: this.mapStyle})

      // Add the marker where the user are
      this.addMarker(position, 'You are here')

    }, (err) => {
      // Log the error if there is one
      console.log(err);
    });

  }

  /**
   * Add a marker on the map
   * @param position the position where the marker wiil be
   * @param content The text to display when the user click on the marker
   */
  addMarker(position: Position, content: string) {
    console.log('[INFO] Adding a Marker in ' + position.coords.latitude + ' : ' + position.coords.longitude)

    // Set the marker image properties
    let image = {
      url: 'assets/marker-map.svg',
      scaledSize: new google.maps.Size(30, 30)
    };

    let marker = this.getInitMarker(position, image)
    let html = "<h5>" + content + "</h5>";

    // Create the info Window
    this.addInfoWindow(marker, html);
  }

  /**
   * Create the info window which will be display to the user when he click on the marker
   * @param marker the marker to bind with
   * @param content the window text content
   */
  addInfoWindow(marker, content) {

    // Create the object infoWindow of google map
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    // Add the click event listener on the marker to display the window
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  /**
   * add a specif marker on the map for a sport event
   * @param position the position of the event
   * @param event the event himself
   */
  addSportMarker(position: Position, event: SportEvent) {
    console.log('[INFO] Adding an event Marker in ' + position.coords.latitude + ' : ' + position.coords.longitude)

    let sport = lowerFirst(event.sport);
    // Set the marker image properties
    let image = {
      url: 'assets/sports/' + sport + '.svg',
      scaledSize: new google.maps.Size(28, 28)
    };

    let marker = this.getInitMarker(position, image)

    // The content which will be display in the info Window from the map marker
    let html = this.setInfoWindowsEventContent(event)

    // Create the info Window
    this.addInfoWindow(marker, html);
  }

  /**
   * Toggle the creation event modal
   */
  addEvent() {
    console.log('[INFO] Open the event creation modal')
    let modal = this.modalCtrl.create(ngEvent);
    modal.present();
  }

  getInitMarker(position: Position, image) {
    // Create a new marker on the map with the correct options and position
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      },
      icon: image
    });

    return marker
  }

  setInfoWindowsEventContent(event: SportEvent) {
    let html = '<div class="iw-container">' +
      '<div class="iw-title">' + event.sport + '</div>' +
      '<div class="iw-content">' + event.date + '</div>' +
      '</div>';
    return html;
  }
}

/**
 * The Position class
 */
class Position {
  coords: {
    latitude: any;
    longitude: any;
  }
}
