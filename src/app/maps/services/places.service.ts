import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Feature, PlacesResponse } from '../interfaces/places.interface';
import { PlacesApiClient } from '../api';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  public userLocation?: [number, number] | undefined;
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  private placesApi = inject(PlacesApiClient);

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
    if (!this.userLocation) throw Error('No existe el userLocation');

    this.isLoadingPlaces = true;
    const url = `/${query}.json`;

    const params = {
      proximity: this.userLocation!.join(','),
    };

    this.placesApi.get<PlacesResponse>(url, { params }).subscribe((resp) => {
      console.log(resp.features);
      this.places = resp.features;
      this.isLoadingPlaces = false;
    });
  }
}
