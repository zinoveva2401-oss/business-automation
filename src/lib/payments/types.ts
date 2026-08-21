export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export interface CheckoutRequest {
  orderId: string;
  productId: string;
  amountKopecks: number;
  currency: 'RUB';
  returnUrl: string;
}

export interface CheckoutSession { providerPaymentId: string; redirectUrl: string; }
export interface VerifiedPayment { providerPaymentId: string; orderId: string; status: PaymentStatus; paidAt?: string; }

export interface PaymentProvider {
  createCheckout(request: CheckoutRequest): Promise<CheckoutSession>;
  verifyServerNotification(rawBody: string, headers: Record<string, string>): Promise<VerifiedPayment>;
  getPayment(providerPaymentId: string): Promise<VerifiedPayment>;
}

// Важно: возвращение покупателя по returnUrl не меняет статус заказа.
// payment_success создаёт только сервер после проверки подписи уведомления
// и повторного запроса статуса у будущего платёжного провайдера.
