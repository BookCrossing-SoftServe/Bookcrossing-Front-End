import { Component, OnInit } from '@angular/core';
import { MapboxService } from 'src/app/core/services/mapbox/mapbox.service';

@Component({
  selector: 'app-mapbox',
  templateUrl: './mapbox.component.html',
  styleUrls: ['./mapbox.component.scss']
})
export class MapboxComponent implements OnInit {

  constructor(private mapbox: MapboxService) { }

  ngOnInit(): void {
    this.mapbox.buildMap();
  }

}
