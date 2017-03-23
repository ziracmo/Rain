import {Component, ElementRef, ViewChild} from '@angular/core';
import {Geolocation} from 'ionic-native';
import {ModalController} from "ionic-angular";
import {ngEvent} from './ngEvent/ngEvent'

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

  constructor(private modalCtrl: ModalController) {
  }

  // When the view is loaded
  ionViewDidLoad() {
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
    console.log('[INFO] Adding a Marker')

    // Set the marker image properties
    var image = {
      url: 'assets/marker-map.svg',
      scaledSize: new google.maps.Size(30, 30)
    };

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
   * Toggle the creation event modal
   */
  addEvent() {
    console.log('[INFO] Open the event creation modal')
    let modal = this.modalCtrl.create(ngEvent);
    modal.present();
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
