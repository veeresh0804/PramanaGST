
export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface Alert {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  severity: AlertSeverity;
  source: 'RECON' | 'RISK_AI' | 'FRAUD_ENGINE';
  isRead: boolean;
}

export interface HealthScore {
  score: number;
  lastUpdated: Date;
  factors: {
    label: string;
    impact: number;
    status: 'GOOD' | 'CONCERNING' | 'BAD';
  }[];
  monthlyTrend: {
    month: string;
    score: number;
  }[];
}

export interface FraudRing {
  id: string;
  nodes: string[];
  riskScore: number;
  patternType: 'CIRCULAR_TRADING' | 'SHELL_INJECTION' | 'INPUT_SWELLING';
  detectedAt: Date;
}
