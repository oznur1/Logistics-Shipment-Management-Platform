export interface Shipment {
  id: number;
  trackingNumber: string;
  originAddress: string;
  destinationAddress: string;
  status: string;
  createdAt: string;
  estimatedDeliveryDate: string | null;
  deliveredAt: string | null;
  customerId: number;
}