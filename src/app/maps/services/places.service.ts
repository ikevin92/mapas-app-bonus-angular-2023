import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Feature, PlacesResponse } from '../interfaces/places.interface';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  public userLocation?: [number, number] | undefined;
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  private http = inject(HttpClient);

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
    this.isLoadingPlaces = true;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?proximity=-76.2227871093026%2C5.889797798607972&language=es&access_token=pk.eyJ1IjoiaWtldmluOTIiLCJhIjoiY2tpaWQ3NzBlMDhoODJ3bnhjeDdnNDE1MiJ9.3bNHLj9E8XyrANMYSXzn8Q`;

    this.http.get<PlacesResponse>(url).subscribe((resp) => {
      console.log(resp.features);
      this.places = resp.features;
      this.isLoadingPlaces = true;
    });
  }
}
