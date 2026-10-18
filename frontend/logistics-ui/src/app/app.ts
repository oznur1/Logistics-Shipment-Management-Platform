
import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';

import { Shipment } from './models/shipment.model';
import {
  ShipmentApiService,
  CreateShipmentRequest,
  UpdateShipmentRequest,
} from './services/shipment-api.service';

@Component({
  selector: 'app-root',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly shipmentApiService = inject(ShipmentApiService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly shipments = signal<Shipment[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');

  protected readonly isSubmitting = signal(false);
  protected readonly formMessage = signal('');

  // Düzenlenen sevkiyatın ID'si
  protected readonly editingShipmentId = signal<number | null>(null);

  // Arama ve durum filtresi
  protected readonly selectedStatus = signal('All');
  protected readonly searchTerm = signal('');

  // Sayfalama
  protected readonly currentPage = signal(1);
  protected readonly pageSize = 5;

  // Arama ve durum filtresini birlikte uygula
  protected get filteredShipments(): Shipment[] {
    const status = this.selectedStatus();
    const search = this.searchTerm().trim().toLowerCase();

    return this.shipments().filter((shipment) => {
      const matchesStatus =
        status === 'All' || shipment.status === status;

      const matchesSearch =
        !search ||
        shipment.trackingNumber.toLowerCase().includes(search) ||
        shipment.originAddress.toLowerCase().includes(search) ||
        shipment.destinationAddress.toLowerCase().includes(search);

      return matchesStatus && matchesSearch;
    });
  }

  // Toplam sayfa sayısı
  protected get totalPages(): number {
    return Math.max(
      1,
      Math.ceil(this.filteredShipments.length / this.pageSize),
    );
  }

  // Yalnızca mevcut sayfanın sevkiyatlarını getir
  protected get paginatedShipments(): Shipment[] {
    const startIndex =
      (this.currentPage() - 1) * this.pageSize;

    return this.filteredShipments.slice(
      startIndex,
      startIndex + this.pageSize,
    );
  }

  // Sayfa değiştir
  protected changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage.set(page);
  }

  // Gösterilen ilk kayıt numarası
  protected get paginationStart(): number {
    if (this.filteredShipments.length === 0) {
      return 0;
    }

    return (this.currentPage() - 1) * this.pageSize + 1;
  }

  // Gösterilen son kayıt numarası
  protected get paginationEnd(): number {
    return Math.min(
      this.currentPage() * this.pageSize,
      this.filteredShipments.length,
    );
  }

  // Dashboard istatistikleri
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

  // Sevkiyat formu
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
    customerId: [
      1,
      [
        Validators.required,
        Validators.min(1),
      ],
    ],
    estimatedDeliveryDate: [''],
  });

  ngOnInit(): void {
    this.loadShipments();
  }

  // Sevkiyatı düzenleme moduna al
  protected editShipment(shipment: Shipment): void {
    this.editingShipmentId.set(shipment.id);
    this.formMessage.set('');

    this.shipmentForm.patchValue({
      originAddress: shipment.originAddress,
      destinationAddress: shipment.destinationAddress,
      customerId: shipment.customerId,
      estimatedDeliveryDate: shipment.estimatedDeliveryDate
        ? shipment.estimatedDeliveryDate.substring(0, 10)
        : '',
    });

    this.shipmentForm.markAsPristine();
    this.shipmentForm.markAsUntouched();

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  // Düzenlemeyi iptal et
  protected cancelEdit(): void {
    this.editingShipmentId.set(null);
    this.formMessage.set('');

    this.shipmentForm.reset({
      originAddress: '',
      destinationAddress: '',
      customerId: 1,
      estimatedDeliveryDate: '',
    });
  }

  // API'den sevkiyatları yükle
  private loadShipments(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.shipmentApiService.getShipments().subscribe({
      next: (data) => {
        this.shipments.set(data);

        // Veri değişince geçerli sayfada kal
        if (this.currentPage() > this.totalPages) {
          this.currentPage.set(this.totalPages);
        }

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

  // Form gönderimi: oluştur veya güncelle
  protected submitShipment(): void {
    this.formMessage.set('');

    if (this.shipmentForm.invalid) {
      this.shipmentForm.markAllAsTouched();
      return;
    }

    const formValue = this.shipmentForm.getRawValue();

    const originAddress = (formValue.originAddress ?? '').trim();
    const destinationAddress = (
      formValue.destinationAddress ?? ''
    ).trim();

    if (!originAddress || !destinationAddress) {
      this.formMessage.set('Adres alanları boş bırakılamaz.');
      return;
    }

    const estimatedDeliveryDate = formValue.estimatedDeliveryDate
      ? new Date(formValue.estimatedDeliveryDate).toISOString()
      : null;

    this.isSubmitting.set(true);

    const shipmentId = this.editingShipmentId();

    if (shipmentId !== null) {
      // Mevcut sevkiyatı güncelle
      const currentShipment = this.shipments().find(
        (shipment) => shipment.id === shipmentId,
      );

      const request: UpdateShipmentRequest = {
        originAddress,
        destinationAddress,
        estimatedDeliveryDate,
        status: currentShipment?.status ?? 'Pending',
      };

      this.shipmentApiService
        .updateShipment(shipmentId, request)
        .subscribe({
          next: () => {
            this.formMessage.set(
              'Sevkiyat başarıyla güncellendi.',
            );

            this.editingShipmentId.set(null);

            this.shipmentForm.reset({
              originAddress: '',
              destinationAddress: '',
              customerId: 1,
              estimatedDeliveryDate: '',
            });

            this.isSubmitting.set(false);
            this.loadShipments();
          },
          error: (error) => {
            console.error('Failed to update shipment:', error);

            this.formMessage.set(
              error.error?.message ??
                'Sevkiyat güncellenemedi. Lütfen tekrar deneyin.',
            );

            this.isSubmitting.set(false);
          },
        });

      return;
    }

    // Yeni sevkiyat oluştur
    const request: CreateShipmentRequest = {
      originAddress,
      destinationAddress,
      customerId: Number(formValue.customerId),
      estimatedDeliveryDate,
    };

    this.shipmentApiService.createShipment(request).subscribe({
      next: () => {
        this.formMessage.set(
          'Sevkiyat başarıyla oluşturuldu.',
        );

        this.shipmentForm.reset({
          originAddress: '',
          destinationAddress: '',
          customerId: 1,
          estimatedDeliveryDate: '',
        });

        // Yeni kayıtların bulunduğu ilk sayfaya dön
        this.currentPage.set(1);

        this.isSubmitting.set(false);
        this.loadShipments();
      },
      error: (error) => {
        console.error('Failed to create shipment:', error);

        this.formMessage.set(
          error.error?.message ??
            'Sevkiyat oluşturulamadı. Lütfen müşteri ID ve API bağlantısını kontrol edin.',
        );

        this.isSubmitting.set(false);
      },
    });
  }
}
