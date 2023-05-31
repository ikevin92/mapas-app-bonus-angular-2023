import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Feature, PlacesResponse } from '../interfaces/places.interface';
import { PlacesApiClient } from '../api';
import { MapService } from './';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  public userLocation?: [number, number] | undefined;
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  private placesApi = inject(PlacesApiClient);
  public mapService = inject(MapService);

  get isUserLocationReady(): boolean {
    return !!this.userLocation;
  }

  constructor() {
    this.getUserLocation();
  }

  getUserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLocation = [coords.longitude, coords.latitude];
          resolve(this.userLocation);
        },
        (err) => {
          alert('no se puede obtener la geo-localización');
          console.error(err);
          reject();
        }
      );
    });
  }

  getPlacesByQuery(query: string = '') {
    if (query.length === 0) {
      this.places = [];
      this.isLoadingPlaces = false;
      return;
    }
    if (!this.userLocation) throw Error('No existe el userLocation');

    this.isLoadingPlaces = true;
    const url = `/${query}.json`;

    const params = {
      proximity: this.userLocation!.join(','),
    };

    this.placesApi.get<PlacesResponse>(url, { params }).subscribe((resp) => {
      this.places = resp.features;
      this.isLoadingPlaces = false;

      this.mapService.createMarkersFromPlaces(this.places);
    });
  }
}
