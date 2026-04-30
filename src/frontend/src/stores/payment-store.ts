import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface PaymentSessionState {
  isProcessing: boolean;
  activePaymentId: string | null;
  lockTimestamp: number | null;
  
  // Actions
  startProcessing: (paymentId: string) => void;
  stopProcessing: () => void;
  clearSession: () => void;
}

export const usePaymentStore = create<PaymentSessionState>()(
  devtools(
    (set) => ({
      isProcessing: false,
      activePaymentId: null,
      lockTimestamp: null,

      startProcessing: (paymentId: string) => 
        set({ 
          isProcessing: true, 
          activePaymentId: paymentId, 
          lockTimestamp: Date.now() 
        }),

      stopProcessing: () => 
        set({ 
          isProcessing: false 
        }),

      clearSession: () => 
        set({ 
          isProcessing: false, 
          activePaymentId: null, 
          lockTimestamp: null 
        }),
    }),
    { name: 'PaymentStore' }
  )
);
