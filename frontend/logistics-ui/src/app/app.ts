
import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Shipment } from './models/shipment.model';
import { ShipmentApiService } from './services/shipment-api.service';

@Component({
  selector: 'app-root',
  imports: [DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})


export class App implements OnInit {
  private readonly shipmentApiService = inject(ShipmentApiService);

  protected readonly shipments = signal<Shipment[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');

  ngOnInit(): void {
    this.loadShipments();
  }

  private loadShipments(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.shipmentApiService.getShipments().subscribe({
      next: (data) => {
        this.shipments.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load shipments:', error);
        this.errorMessage.set(
          'Sevkiyatlar yüklenemedi. Lütfen API bağlantısını kontrol edin.',
        );
        this.isLoading.set(false);
      },
    });
  }
}
