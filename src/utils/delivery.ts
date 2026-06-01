export type DeliveryStepId = 'completed' | 'preparing' | 'in_transit' | 'delivered';

export type DeliveryStep = {
  id: DeliveryStepId;
  title: string;
  subtitle?: string;
};

const STEPS: DeliveryStep[] = [
  { id: 'completed', title: 'Plan complete' },
  { id: 'preparing', title: 'Preparing order' },
  { id: 'in_transit', title: 'In transit' },
  { id: 'delivered', title: 'Delivered' },
];

export function deliverySteps(_status?: string): DeliveryStep[] {
  return STEPS;
}

/** Index of the current step; 4 means every step is complete (delivered). */
export function activeDeliveryStepIndex(status: string | undefined): number {
  switch (status) {
    case 'delivered':
      return 4;
    case 'in_transit':
      return 2;
    case 'processing':
    case 'pending':
      return 1;
    default:
      return 0;
  }
}

export function deliveryStatusColor(status: string | undefined): string {
  switch (status) {
    case 'delivered':
      return '#059669';
    case 'in_transit':
      return '#D97706';
    case 'processing':
      return '#6B0F1A';
    default:
      return '#9B777E';
  }
}
