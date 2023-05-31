import { Component, OnInit, inject } from '@angular/core';
import { PlacesService } from '../../services';

@Component({
  selector: 'app-map-screen',
  templateUrl: './map-screen.component.html',
  styleUrls: ['./map-screen.component.css'],
})
export class MapScreenComponent implements OnInit {
  private placesService = inject(PlacesService);

  ngOnInit(): void {}
}
