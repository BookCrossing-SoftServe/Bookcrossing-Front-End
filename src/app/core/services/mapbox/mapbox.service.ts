import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import * as mapboxgl from "mapbox-gl";
import * as MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

@Injectable({
  providedIn: "root",
})
export class MapboxService {
  map: mapboxgl.Map;
  style = "mapbox://styles/mapbox/streets-v11";
  lat = 49.83305;
  lng = 23.997775;
  zoom = 16;

  geocoder;

  constructor() {
    mapboxgl.accessToken = environment.mapbox.accessToken;
  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: "map",
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat],
    });

    const marker = new mapboxgl.Marker()
      .setLngLat([this.lng, this.lat])
      .addTo(this.map);

    this.geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      placeholder: 'Search',
      mapboxgl: mapboxgl,
      marker: false
    });

    // this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(this.geocoder);
    // this.map.addControl(new mapboxgl.MapboxGeocoder());
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
