import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { PlacesService } from '../../services';
import { Map } from 'mapbox-gl';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
})
export class MapViewComponent implements AfterViewInit {
  @ViewChild('mapDiv')
  mapDivElement!: ElementRef;

  private placesService = inject(PlacesService);

  ngAfterViewInit(): void {
    if (!this.placesService.userLocation)
      throw Error('No hay places en userLocation');

    const map = new Map({
      container: this.mapDivElement.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.placesService.userLocation, // starting position [lng, lat]
      zoom: 15, // starting zoom
    });
  }
}
