import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapboxService {

map: mapboxgl.Map;
style = 'mapbox://styles/mapbox/streets-v11';
lat = 49.833050;
lng = 23.997775;
zoom = 16;

  constructor() {
    mapboxgl.accessToken = environment.mapbox.accessToken;
   }

   buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat]
    })
    this.map.addControl(new mapboxgl.NavigationControl());
  }

  //  getMarkers(){
  //    const geoJson = [{
  //      'type': 'Fetature',
  //      'geometry': {
  //        'type': 'Point',
  //        'coordinates': ['80.20929129999999', '13.0569951']
  //      },
  //      'properties': {
  //        'message': 'Chennai'
  //      }, {
  //       'type': 'Feature',
  //       'geometry': {
  //         'type': 'Point',
  //         'coordinates': ['77.350048', '12.953847' ]
  //       },
  //       'properties': {
  //         'message': 'bangulare'
  //       }
  //    }];
  //    return geoJson;
  //  }
}
