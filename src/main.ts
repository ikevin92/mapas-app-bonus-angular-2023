import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

Mapboxgl.accessToken =
  'pk.eyJ1IjoiaWtldmluOTIiLCJhIjoiY2xpM242YjlnMHF2aTNlbXUybTIzeWViNiJ9.U2b8Y2Gdg4uBcNY_us-sbA';

if (!navigator.geolocation) {
  alert('Navegador no soporta la geolocation');

  throw new Error('Navegador no soporta la geolocation');
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
