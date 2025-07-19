export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
}

export type ConditionType = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

export type SeverityType = 'critical' | 'high' | 'medium' | 'low';
