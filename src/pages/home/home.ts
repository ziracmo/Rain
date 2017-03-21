import {Component, ElementRef, ViewChild} from '@angular/core';
import { Geolocation } from 'ionic-native';

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
      "stylers": [
        {
          "saturation": -100
        },
        {
          "gamma": 1
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.business",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.business",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.place_of_worship",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.place_of_worship",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "featureType": "water",
      "stylers": [
        {
          "visibility": "on"
        },
        {
          "saturation": 50
        },
        {
          "gamma": 0
        },
        {
          "hue": "#50a5d1"
        }
      ]
    },
    {
      "featureType": "administrative.neighborhood",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#333333"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text",
      "stylers": [
        {
          "weight": 0.5
        },
        {
          "color": "#333333"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "labels.icon",
      "stylers": [
        {
          "gamma": 1
        },
        {
          "saturation": 50
        }
      ]
    }
  ]

  constructor() {
  }

  ionViewDidLoad(){
    this.loadMap();
  }

  loadMap(){
    console.log('[INFO] Loading The map')
    Geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.map.setOptions({styles: this.mapStyle})
      this.addMarker(position)

    }, (err) => {
      console.log(err);
    });

  }

  addMarker(position: Position){
    console.log('[INFO] Adding a Marker')

    var image = {
      url: '../assets/marker-map.svg',
      scaledSize : new google.maps.Size(30, 30)
    };

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      },
      icon : image
    });

    let content = "<h4>Information!</h4>";

    this.addInfoWindow(marker, content);

  }

  addInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }

}

class Position {
  coords: {
    latitude: any;
    longitude: any;
  }
}
