import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shipment } from '../models/shipment.model';

export interface CreateShipmentRequest {
  originAddress: string;
  destinationAddress: string;
  customerId: number;
  estimatedDeliveryDate: string | null;
}

export interface UpdateShipmentRequest {
  originAddress: string;
  destinationAddress: string;
  customerId: number;
  estimatedDeliveryDate: string | null;
  status: string;
}


@Injectable({
  providedIn: 'root',
})
export class ShipmentApiService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:5068/api/Shipment';

  getShipments(): Observable<Shipment[]> {
    return this.http.get<Shipment[]>(this.apiUrl);
  }

  createShipment(
    shipment: CreateShipmentRequest,
  ): Observable<Shipment> {
    return this.http.post<Shipment>(this.apiUrl, shipment);
  }

  updateShipment(
    id: number,
    shipment: UpdateShipmentRequest,
  ): Observable<Shipment> {
    return this.http.put<Shipment>(
      `${this.apiUrl}/${id}`,
      shipment,
    );
  }

  deleteShipment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}