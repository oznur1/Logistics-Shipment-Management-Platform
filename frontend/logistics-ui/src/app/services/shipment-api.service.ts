
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shipment } from '../models/shipment.model';


@Injectable ({
    providedIn:"root"
})

export class ShipmentApiService {
    private readonly http =inject(HttpClient);

    private readonly apiUrl = 'http://localhost:5068/api/Shipment';

    getShipments(): Observable<Shipment[]> {
        return this.http.get<Shipment[]>(this.apiUrl);
    }
}