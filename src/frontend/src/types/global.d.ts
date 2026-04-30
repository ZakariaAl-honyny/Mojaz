import { UseFormTrigger, UseFormSetFocus } from 'react-hook-form';

declare global {
  interface Window {
    __step1Form?: { trigger: UseFormTrigger<any>; setFocus: UseFormSetFocus<any> };
    __step2Form?: { trigger: UseFormTrigger<any>; setFocus: UseFormSetFocus<any> };
    __step3Form?: { trigger: UseFormTrigger<any>; setFocus: UseFormSetFocus<any> };
    __step4Form?: { trigger: UseFormTrigger<any>; setFocus: UseFormSetFocus<any> };
  }
}

export {};
