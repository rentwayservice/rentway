// registration-form.types.ts
import type { RegisterFormValues } from "./register-form.dto";

export type FormData = RegisterFormValues;

export type Step = 1 | 2 | 3;

export interface StepProps {
  onNext?: () => void;
  onPrevious?: () => void;
  isPending?: boolean;
}

export interface RegistrationFormProps {
  onComplete?: (data: FormData) => void;
  initialStep?: Step;
}

export interface FormStepComponentProps {
  onNext: () => void;
  onPrevious: () => void;
}

export interface StepIndicatorProps {
  currentStep: Step;
  completedSteps: Step[];
}

export type ServerResponse = {
  success: boolean;
  vendorId?: string;
  error?: any;
  message?: string;
};
