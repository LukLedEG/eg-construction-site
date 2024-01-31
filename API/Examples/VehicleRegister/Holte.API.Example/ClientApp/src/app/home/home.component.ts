import { Component } from '@angular/core';
import { BaseHttpService } from '../http-service/base-http-service';
import { filter, of, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

export interface ICurrentTrackerDetails {
  displayName: string;
  registrationNumber: string;
  vehicleId: string;
  trackerId: string;
  imei: string;
  longitude: number;
  latitude: number;
  batteryVoltage: number;
  externalVoltage: number;
  gsmOperatorCode: number;
  satellitesQuantity: number;
  gsmSignal: number;
  speed: number;
  altitude: number;
  angle: number;
  eventDate: Date;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  data: ICurrentTrackerDetails[] = [];
  retrievingData: boolean = false;

  constructor(
    private readonly httpService: BaseHttpService,
  ) {}

  retrieveVehicleNames() {
    this.retrievingData = true;

    this.httpService.get<any>('VehicleRegister/GetCurrentTrackerDetails')
      .pipe(
        catchError(() => {
          this.retrievingData = false;
          return of({ data: []});
        }),
        tap(() => {
          this.retrievingData = false;
          this.data = [];
        }),
        filter((response) => response.data.length))
      .subscribe((response) => {
          this.data = response.data;
        }
      );
  }

  getXml(vehicleId: string) {
    return this.httpService.get('VehicleRegister/GetVehicleTrips',
      { vehicleId: vehicleId },
      {
        responseType: 'blob',
        headers: new HttpHeaders({
          'Accept': 'application/xml'
        })
      })
      .subscribe((response) => {
        const url = URL.createObjectURL(response.data as any);

        const a = document.createElement('a');
        a.href = url;
        a.download = `vehicle-trips-${vehicleId}.xml`;
        document.body.appendChild(a);
        a.click();

        URL.revokeObjectURL(url);
        a.remove();
      });
  }

  getJson(vehicleId: string) {
    this.httpService.get<any>('VehicleRegister/GetVehicleTrips', { vehicleId: vehicleId }, { responseType: 'blob' })
      .subscribe((response) => {
        const url = URL.createObjectURL(response.data as any);

        const a = document.createElement('a');
        a.href = url;
        a.download = `vehicle-trips-${vehicleId}.json`;
        document.body.appendChild(a);
        a.click();

        URL.revokeObjectURL(url);
        a.remove();
      });
  }
}
