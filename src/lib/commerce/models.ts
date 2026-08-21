export interface MinimalOrder {
  id: string;
  productId: string;
  productVersion: string;
  amountKopecks: number;
  status: 'created' | 'payment_pending' | 'paid' | 'delivery_ready' | 'delivered' | 'refunded';
  buyerEmail: string;
  consentVersion: string;
  createdAt: string;
  paidAt?: string;
}

export interface PaymentRecord {
  orderId: string;
  provider: string;
  providerPaymentId: string;
  status: string;
  amountKopecks: number;
  confirmedAt?: string;
}

export interface DeliveryToken {
  orderId: string;
  tokenHash: string;
  expiresAt: string;
  downloadCount: number;
}

export interface OperationLog {
  operationId: string;
  orderId: string;
  event: 'checkout_start' | 'payment_success' | 'delivery_created' | 'download_success';
  occurredAt: string;
  result: 'success' | 'failure';
  technicalCode?: string;
}
