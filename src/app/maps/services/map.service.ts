import { Injectable, inject } from '@angular/core';
import { LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places.interface';
import { DirectionsApiClient } from '../api';
import { DirectionsResponse, Route } from '../interfaces/directions.interface';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map?: Map;
  private markers: Marker[] = [];

  private directionsApi = inject(DirectionsApiClient);

  get isMapReady() {
    return !!this.map;
  }

  setMap(map: Map) {
    this.map = map;
  }

  flyTo(coords: LngLatLike) {
    if (!this.isMapReady) throw Error('el mapa no esta inicializado');

    this.map?.flyTo({
      zoom: 14,
      center: coords,
    });
  }

  createMarkersFromPlaces(places: Feature[], userLocation: [number, number]) {
    if (!this.map) throw Error('mapa no inicializado');
    this.markers.forEach((marker) => marker.remove());
    const newMarkers = [];

    for (const place of places) {
      const [lng, lat] = place.center as [number, number];
      const popup = new Popup().setHTML(`
      <h6>${place.text}</h6>
      <span>${place.place_name_es}</span>
      `);

      const newMarker = new Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.map);

      newMarkers.push(newMarker);
    }

    this.markers = newMarkers;

    if (places.length === 0) return;

    //Limites del mapa
    const bounds = new LngLatBounds();
    newMarkers.forEach((marker) => bounds.extend(marker.getLngLat()));
    //* poner mi marcador
    bounds.extend(userLocation);

    //* ajustar mapa
    this.map.fitBounds(bounds, {
      padding: 200,
    });
  }

  getRouteBetweenToPoints(start: [number, number], end: [number, number]) {
    this.directionsApi
      .get<DirectionsResponse>(`/${start.join(',')};${end.join(',')}`)
      .subscribe((resp) => this.drawPolyline(resp.routes[0]));
  }

  private drawPolyline(route: Route) {
    console.log({
      kms: route.distance / 1000,
      duration: route.duration / 60,
    });

    if (!this.map) throw Error('Mapa no inicializado');

    const coords = route.geometry.coordinates;
    const bounds = new LngLatBounds();

    coords.forEach(([lng, lat]) => bounds.extend([lng, lat]));

    this.map?.fitBounds(bounds, {
      padding: 200,
    });
  }
}
