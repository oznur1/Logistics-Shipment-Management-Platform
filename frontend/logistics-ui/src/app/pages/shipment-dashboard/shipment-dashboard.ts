import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';

import { Shipment } from '../../models/shipment.model';
import {
  ShipmentApiService,
  CreateShipmentRequest,
  UpdateShipmentRequest,
} from '../../services/shipment-api.service';

@Component({
  selector: 'app-shipment-dashboard',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './shipment-dashboard.html',
  styleUrl: './shipment-dashboard.css',
})
export class ShipmentDashboard implements OnInit {
  private readonly shipmentApiService = inject(ShipmentApiService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly shipments = signal<Shipment[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly isSubmitting = signal(false);
  protected readonly formMessage = signal('');

  protected readonly editingShipmentId = signal<number | null>(null);
  protected readonly editingShipmentStatus = signal('Pending');

  protected readonly selectedStatus = signal('All');
  protected readonly searchTerm = signal('');
  protected readonly currentPage = signal(1);
  protected readonly pageSize = 5;

  protected readonly shipmentForm = this.formBuilder.group({
    originAddress: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200),
      ],
    ],
    destinationAddress: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200),
      ],
    ],
    customerId: [1, [Validators.required, Validators.min(1)]],
    estimatedDeliveryDate: [''],
  });

  ngOnInit(): void {
    this.loadShipments();
  }

  protected loadShipments(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.shipmentApiService.getShipments().subscribe({
      next: (shipments) => {
        this.shipments.set(shipments);
        this.isLoading.set(false);

        if (this.currentPage() > this.totalPages) {
          this.currentPage.set(this.totalPages);
        }
      },
      error: (error) => {
        console.error('Sevkiyatlar yüklenemedi:', error);
        this.errorMessage.set(
          'Sevkiyatlar yüklenemedi. Oturumunuzu ve API bağlantısını kontrol edin.',
        );
        this.isLoading.set(false);
      },
    });
  }

  protected submitShipment(): void {
    this.formMessage.set('');

    if (this.shipmentForm.invalid) {
      this.shipmentForm.markAllAsTouched();
      return;
    }

    const formValue = this.shipmentForm.getRawValue();

    const request: CreateShipmentRequest = {
      originAddress: formValue.originAddress!.trim(),
      destinationAddress: formValue.destinationAddress!.trim(),
      customerId: Number(formValue.customerId),
      estimatedDeliveryDate: formValue.estimatedDeliveryDate || null,
    };

    this.isSubmitting.set(true);

    const editingId = this.editingShipmentId();

    if (editingId !== null) {
      const updateRequest: UpdateShipmentRequest = {
        ...request,
        status: this.editingShipmentStatus(),
      };

      this.shipmentApiService
        .updateShipment(editingId, updateRequest)
        .subscribe({
          next: () => {
            this.formMessage.set('Sevkiyat başarıyla güncellendi.');
            this.finishSubmission();
          },
          error: (error) => {
            console.error('Sevkiyat güncellenemedi:', error);
            this.formMessage.set('Sevkiyat güncellenemedi.');
            this.isSubmitting.set(false);
          },
        });

      return;
    }

    this.shipmentApiService.createShipment(request).subscribe({
      next: () => {
        this.formMessage.set('Sevkiyat başarıyla oluşturuldu.');
        this.finishSubmission();
      },
      error: (error) => {
        console.error('Sevkiyat oluşturulamadı:', error);
        this.formMessage.set('Sevkiyat oluşturulamadı.');
        this.isSubmitting.set(false);
      },
    });
  }

  private finishSubmission(): void {
    this.isSubmitting.set(false);
    this.cancelEdit();
    this.loadShipments();
  }

  protected editShipment(shipment: Shipment): void {
    this.editingShipmentId.set(shipment.id);
    this.editingShipmentStatus.set(shipment.status);
    this.formMessage.set('');

    this.shipmentForm.patchValue({
      originAddress: shipment.originAddress,
      destinationAddress: shipment.destinationAddress,
      customerId: shipment.customerId,
      estimatedDeliveryDate: shipment.estimatedDeliveryDate
        ? shipment.estimatedDeliveryDate.substring(0, 10)
        : '',
    });
  }

  protected cancelEdit(): void {
    this.editingShipmentId.set(null);
    this.editingShipmentStatus.set('Pending');

    this.shipmentForm.reset({
      originAddress: '',
      destinationAddress: '',
      customerId: 1,
      estimatedDeliveryDate: '',
    });
  }

  protected deleteShipment(id: number): void {
    const confirmed = confirm(
      `${id} numaralı sevkiyatı silmek istediğinize emin misiniz?`,
    );

    if (!confirmed) {
      return;
    }

    this.shipmentApiService.deleteShipment(id).subscribe({
      next: () => {
        this.formMessage.set('Sevkiyat silindi.');
        this.loadShipments();
      },
      error: (error) => {
        console.error('Sevkiyat silinemedi:', error);
        this.errorMessage.set('Sevkiyat silinemedi.');
      },
    });
  }

  protected setSearchTerm(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  protected setSelectedStatus(value: string): void {
    this.selectedStatus.set(value);
    this.currentPage.set(1);
  }

  protected get filteredShipments(): Shipment[] {
    const search = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();

    return this.shipments().filter((shipment) => {
      const matchesStatus =
        status === 'All' || shipment.status === status;

      const matchesSearch =
        !search ||
        shipment.trackingNumber.toLowerCase().includes(search) ||
        shipment.originAddress.toLowerCase().includes(search) ||
        shipment.destinationAddress.toLowerCase().includes(search) ||
        String(shipment.id).includes(search);

      return matchesStatus && matchesSearch;
    });
  }

  protected get paginatedShipments(): Shipment[] {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredShipments.slice(start, start + this.pageSize);
  }

  protected get totalPages(): number {
    return Math.max(
      1,
      Math.ceil(this.filteredShipments.length / this.pageSize),
    );
  }

  protected changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage.set(page);
  }

  protected get totalShipments(): number {
    return this.shipments().length;
  }

  protected get pendingShipments(): number {
    return this.shipments().filter(
      (shipment) => shipment.status === 'Pending',
    ).length;
  }

  protected get inTransitShipments(): number {
    return this.shipments().filter(
      (shipment) => shipment.status === 'InTransit',
    ).length;
  }

  protected get deliveredShipments(): number {
    return this.shipments().filter(
      (shipment) => shipment.status === 'Delivered',
    ).length;
  }

  protected get paginationStart(): number {
    return this.filteredShipments.length === 0
      ? 0
      : (this.currentPage() - 1) * this.pageSize + 1;
  }

  protected get paginationEnd(): number {
    return Math.min(
      this.currentPage() * this.pageSize,
      this.filteredShipments.length,
    );
  }
}